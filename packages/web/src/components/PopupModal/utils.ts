import React from 'react';

interface PopupProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm?: () => Promise<void>;
  setModalHeader: React.Dispatch<React.SetStateAction<String>>;
  setBodyText: React.Dispatch<React.SetStateAction<string | undefined>>;
  onClose: () => void;
  setConfirmButtonVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onOpen: () => void;
  isLoading: boolean;
  succussMessage?: string;
  errorMessage?: string;
  openButtonPropsLocal: any;
  header: String;
}

export const popupProps = ({ setIsLoading,
  onConfirm,
  setModalHeader,
  setBodyText,
  onClose,
  setConfirmButtonVisible,
  onOpen,
  isLoading,
  succussMessage,
  errorMessage,
  openButtonPropsLocal,
  header,
}:PopupProps) => {
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
  
  const openButtonProps = {
    ...openButtonPropsLocal,
    onClick: () => {
      setModalHeader(header);
      setBodyText(undefined);
      setConfirmButtonVisible(true);
      onOpen();
    }
  };
  
  const confirmProps = {
    isLoading,
    colorScheme: 'blue',
    onClick: onConfirmClick,
  };
  return { openButtonProps, confirmProps };
}