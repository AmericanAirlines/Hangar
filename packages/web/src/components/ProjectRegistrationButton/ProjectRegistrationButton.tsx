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
import { ProjectRegistrationForm } from '../ProjectRegistrationForm';
import { useUserStore } from '../../stores/user';
import { useRedirectToAuth } from '../layout/RedirectToAuthModal';

const openModalQueryKey = 'registration';

export const ProjectRegistrationButton: React.FC = () => {
  const router = useRouter();
  const hasHandledQueryRef = React.useRef(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { triggerRedirect } = useRedirectToAuth();
  const [, setContributorInviteCode] = React.useState<string>('');

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

      <Modal isOpen={isOpen} onClose={onClose} size="xl" onOverlayClick={() => null}>
        <ModalOverlay />
        <ModalContent pb={4} mx={3}>
          <ModalHeader>Project Registration</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <ProjectRegistrationForm
              onComplete={onClose}
              setContributorInviteCode={setContributorInviteCode}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
