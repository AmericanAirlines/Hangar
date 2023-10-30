import React from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { RegistrationForm } from './RegistrationForm';
import { useUserStore } from '../../stores/user';
import { useRedirectToAuth } from '../layout/RedirectToAuthModal';

const openModalQueryKey = 'registration';

export const ProjectRegistrationButton: React.FC = () => {
  const router = useRouter();
  const hasHandledQueryRef = React.useRef(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { triggerRedirect } = useRedirectToAuth();

  React.useEffect(() => {
    // Handle `registration=true`
    if (router.isReady && !hasHandledQueryRef.current) {
      hasHandledQueryRef.current = true;
      if (router.query[openModalQueryKey]) {
        onOpen();
        void router.push({ query: {} }, undefined, { shallow: true });
      }
    }
  }, [onOpen, router]);

  const onRegistrationClick = () => {
    if (useUserStore.getState().user) {
      onOpen();
    } else {
      triggerRedirect({ returnTo: `/?${openModalQueryKey}=true` });
    }
  };

  return (
    <>
      <Button onClick={onRegistrationClick}>Register Project</Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent pb={4} mx={3}>
          <ModalHeader>Project Registration</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <RegistrationForm onSubmit={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
