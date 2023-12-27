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
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ProjectRegistrationForm } from '../ProjectRegistrationForm';
import { useUserStore } from '../../stores/user';
import { useRedirectToAuth } from '../layout/RedirectToAuthModal';

const [contributorInviteCode, setContributorInviteCode] = React.useState<string>('');

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
            <Text color="red.500" mt={2}>
              + Warning: The contributor invite code will not be accessible again after closing this
              modal. +{' '}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
