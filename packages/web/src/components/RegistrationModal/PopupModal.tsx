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
  openButtonProps?: ButtonProps;
}

export const PopUpModal: React.FC<PopupModalProps> = (props) => {
  const { openModalText, header, children } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalHeader, setModalHeader] = useState(header);
  const [bodyText, setBodyText] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmButtonVisible, setConfirmButtonVisible] = useState(true);
  const { openButtonProps, confirmProps } = popupProps({
    setIsLoading,
    setModalHeader,
    setBodyText,
    setConfirmButtonVisible,
    onOpen,
    isLoading,
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
              {!confirmButtonVisible && <Button {...confirmProps}>Confirm</Button>}
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
