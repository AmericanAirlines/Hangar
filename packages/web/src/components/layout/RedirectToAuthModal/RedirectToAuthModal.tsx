/* eslint-disable max-lines */
import React from 'react';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay } from '@chakra-ui/react';
import { Config, wait } from '@hangar/shared';
import { useRedirectToAuth } from './useRedirectToAuth';
import { SlackContent } from './SlackContent';
import { PingfedContent } from './PingfedContent';

const countdownDurationSeconds = Config.Auth.method === 'slack' ? 15 : 5;

export const RedirectToAuthModal: React.FC = () => {
  const { redirect } = useRedirectToAuth();
  const { isOpen, closeModal } = useRedirectToAuth();
  const [secondsRemaining, setSecondsRemaining] = React.useState<number>();

  React.useEffect(() => {
    let subscribed = true;
    const countdown = async (seconds: number = countdownDurationSeconds) => {
      if (!subscribed) return;

      setSecondsRemaining(seconds);
      await wait(1000);

      const updatedSeconds = seconds - 1;

      if (updatedSeconds >= 1) {
        void countdown(updatedSeconds);
      } else {
        setSecondsRemaining(undefined);
        redirect();
      }
    };

    if (isOpen) {
      void countdown();
    }

    return () => {
      subscribed = false;
    };
  }, [isOpen, redirect]);

  const onContinue = () => {
    redirect();
    setSecondsRemaining(undefined);
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent mx={3}>
        <ModalCloseButton />
        <ModalBody mt={3}>
          {Config.Auth.method === 'slack' && (
            <SlackContent secondsRemaining={secondsRemaining} onContinue={onContinue} />
          )}

          {Config.Auth.method === 'pingfed' && (
            <PingfedContent secondsRemaining={secondsRemaining} onContinue={onContinue} />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
