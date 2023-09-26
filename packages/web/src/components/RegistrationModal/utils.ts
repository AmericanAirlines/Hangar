import React from 'react';
import { FormikProps } from 'formik';
import { InputProps, TextareaProps } from '@chakra-ui/react';
import { SerializedProject } from '@hangar/shared';

interface PopupProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setModalHeader: React.Dispatch<React.SetStateAction<string>>;
  setBodyText: React.Dispatch<React.SetStateAction<string | undefined>>;
  setConfirmButtonVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onOpen: () => void;
  isLoading: boolean;
  header: string;
}

export const popupProps = ({
  setIsLoading,
  setModalHeader,
  setBodyText,
  setConfirmButtonVisible,
  onOpen,
  isLoading,
  header,
}: PopupProps) => {
  const onConfirmClick = async () => {
    setIsLoading(false);
    setConfirmButtonVisible(false);
  };

  const openButtonProps = {
    onClick: () => {
      setModalHeader(header);
      setBodyText(undefined);
      setConfirmButtonVisible(true);
      onOpen();
    },
  };

  const confirmProps = {
    isLoading,
    onClick: onConfirmClick,
  };
  return { openButtonProps, confirmProps };
};

export type RegistrationSchema = Omit<
  SerializedProject,
  | 'id'
  | 'contributors'
  | 'judgeVisits'
  | 'activeJudgeCount'
  | 'createdAt'
  | 'updatedAt'
  | 'inviteCode'
>;
export type RegistrationFormik = FormikProps<RegistrationSchema>;

export interface RegistrationFormProps {
  initialValues?: RegistrationSchema;
  onSubmit?(): void;
}

export type FormProps = (
  key: keyof RegistrationSchema,
  formik: RegistrationFormik,
) => InputProps | TextareaProps;
