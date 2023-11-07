/* eslint-disable max-lines */
import React from 'react';
import {
  Button,
  Code,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useClipboard,
} from '@chakra-ui/react';
import { wait } from '@hangar/shared';
import { useRedirectToAuth } from './useRedirectToAuth';
import { env } from '../../../env';
import { JoinSlackButton } from '../../JoinSlackButton';

const countdownDurationSeconds = 15;

export const RedirectToAuthModal: React.FC = () => {
  const { redirect } = useRedirectToAuth();
  const { onCopy } = useClipboard(env.slackWorkspaceName ?? '');
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

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent mx={3}>
        <ModalCloseButton />
        <ModalBody mt={3}>
          <Flex
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap={7}
            p={2}
            textAlign="center"
          >
            <Heading>
              {secondsRemaining !== undefined
                ? `Redirecting to login in ${secondsRemaining} seconds...`
                : 'Redirecting...'}
            </Heading>
            <Text fontWeight="bold" fontSize="xl">
              The next screen will ask for a <Code>Slack Workspace Name</Code>
            </Text>
            <Flex direction="column" alignItems="center" gap={1}>
              <Text>Workspace Name:</Text>
              <Code>{env.slackWorkspaceName}</Code>
            </Flex>
            <Button
              maxW="full"
              variant="secondary"
              onClick={() => {
                onCopy();
                setSecondsRemaining(undefined); // Reset in case the user tries to come back
                redirect();
              }}
              whiteSpace="pre-wrap"
              wordBreak="break-word"
              py={{ base: 6, md: 0 }}
            >
              Copy Workspace Name and Continue
            </Button>

            <JoinSlackButton variant="ghost" />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
