import React, { useState, PropsWithChildren } from 'react';
import {
  Button,
  ButtonProps,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { popupProps } from './utils';

interface PopupModalProps extends PropsWithChildren {
  openModalText: string;
  header: string;
  hideCloseButton?: boolean;
  openButtonProps?: ButtonProps;
  onConfirm?: () => Promise<void>;
}

export const PopUpModal: React.FC<PopupModalProps> = (props) => {
  const {
    openModalText,
    header,
    openButtonProps: openButtonPropsLocal,
    hideCloseButton = false,
    children,
    onConfirm,
  } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalHeader, setModalHeader] = useState(header);
  const [bodyText, setBodyText] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmButtonVisible, setConfirmButtonVisible] = useState(true);
  const { openButtonProps, confirmProps } = popupProps({
    setIsLoading,
    onConfirm,
    setModalHeader,
    setBodyText,
    onClose,
    setConfirmButtonVisible,
    onOpen,
    isLoading,
    openButtonPropsLocal,
    header,
  });

  return (
    <>
      <Button {...openButtonProps}>{openModalText}</Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalHeader}</ModalHeader>

          <ModalCloseButton />

          <ModalBody>{bodyText ?? children}</ModalBody>

          <ModalFooter>
            <HStack justifyContent="flex-end">
              {hideCloseButton && (
                <Button variant="ghost" onClick={onClose}>
                  Close
                </Button>
              )}
              {!(onConfirm && confirmButtonVisible) && <Button {...confirmProps}>Confirm</Button>}
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
