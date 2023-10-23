import { FormikProps } from 'formik';
import { InputProps, TextareaProps } from '@chakra-ui/react';
import { SerializedProject } from '@hangar/shared';

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
