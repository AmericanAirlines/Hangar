import React, { useState } from 'react';
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

interface PopupModalProps {
  openModalText: String;
  header: String;
  hideCloseButton?: boolean;
  openButtonProps?: ButtonProps;
  onConfirm?: () => Promise<void>;
  succussMessage?: string;
  errorMessage?: string;
}

export const PopUpModal: React.FC<PopupModalProps> = ({
  openModalText,
  header,
  openButtonProps,
  hideCloseButton = false,
  children,
  onConfirm,
  succussMessage,
  errorMessage,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalHeader, setModalHeader] = useState(header);
  const [bodyText, setBodyText] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmButtonVisible, setConfirmButtonVisible] = useState(true);

  const onConfirmClick = async () => {
    try {
      setIsLoading(true);
      await onConfirm!();

      if (succussMessage) {
        setModalHeader('Success');
        setBodyText(succussMessage);
      } else {
        onClose();
      }
    } catch (err) {
      setModalHeader('Uh oh');
      setBodyText(errorMessage ?? (err as Error).message);
    }

    setIsLoading(false);
    setConfirmButtonVisible(false);
  };

  return (
    <>
      <Button
        {...openButtonProps}
        onClick={() => {
          setModalHeader(header);
          setBodyText(undefined);
          setConfirmButtonVisible(true);
          onOpen();
        }}
      >
        {openModalText}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalHeader}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{bodyText ?? children}</ModalBody>

          <ModalFooter>
            <HStack justifyContent="flex-end">
              {!hideCloseButton ? (
                <Button variant="ghost" onClick={onClose}>
                  Close
                </Button>
              ) : null}
              {onConfirm && confirmButtonVisible ? (
                <Button isLoading={isLoading} colorScheme="blue" onClick={onConfirmClick}>
                  Confirm
                </Button>
              ) : null}
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
