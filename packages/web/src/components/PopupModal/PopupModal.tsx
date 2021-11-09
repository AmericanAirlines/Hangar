import React, { useState } from 'react';
import {
  Button,
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
  body: String;
  openButtonVariant?: 'link' | 'outline' | (string & {}) | 'ghost' | 'solid' | 'unstyled';
  onConfirm?: () => Promise<void>;
  succussMessage?: string;
  errorMessage?: string;
}

export const PopUpModal: React.FC<PopupModalProps> = ({
  openModalText,
  header,
  openButtonVariant,
  body,
  onConfirm,
  succussMessage,
  errorMessage,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalHeader, setModalHeader] = useState(header);
  const [bodyText, setBodyText] = useState(body);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmButtonVisible, setConfirmButtonVisible] = useState(true);

  return (
    <>
      <Button
        onClick={() => {
          setModalHeader(header);
          setBodyText(body);
          setConfirmButtonVisible(true);
          onOpen();
        }}
        variant={openButtonVariant}
      >
        {openModalText}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalHeader}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{bodyText}</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            {onConfirm && confirmButtonVisible && (
              <Button
                isLoading={isLoading}
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    await onConfirm();
                    if (succussMessage) {
                      setModalHeader('Success !!!');
                      setBodyText(succussMessage);
                    }
                  } catch (e) {
                    if (errorMessage) {
                      setModalHeader('An Error Occurred');
                      setBodyText(errorMessage);
                    }
                  } finally {
                    setIsLoading(false);
                    setConfirmButtonVisible(false);
                  }
                }}
              >
                Confirm
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
