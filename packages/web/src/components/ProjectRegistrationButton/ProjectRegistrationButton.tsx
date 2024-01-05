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
import { ProjectWithInviteCode } from '@hangar/shared';
import { ProjectRegistrationForm } from '../ProjectRegistrationForm';
import { useUserStore } from '../../stores/user';
import { useRedirectToAuth } from '../layout/RedirectToAuthModal';
import { CopyProjectInviteCode } from './CopyProjectInviteCode/CopyProjectInviteCode';

const openModalQueryKey = 'registration';

export const ProjectRegistrationButton: React.FC = () => {
  const router = useRouter();
  const hasHandledQueryRef = React.useRef(false);
  const [newProject, setNewProject] = React.useState<ProjectWithInviteCode | undefined>();
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

      <Modal isOpen={isOpen} onClose={onClose} size="xl" closeOnOverlayClick={!newProject}>
        <ModalOverlay />
        <ModalContent pb={4} mx={3}>
          <ModalHeader>Project Registration</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {newProject ? (
              <CopyProjectInviteCode project={newProject} />
            ) : (
              <ProjectRegistrationForm
                onComplete={(project) => {
                  if ('inviteCode' in project) {
                    setNewProject(project);
                  }
                }}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
