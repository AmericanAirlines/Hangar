import { FormikProps } from "formik";
import { InputProps, TextareaProps } from "@chakra-ui/react";
import { SerializedProject } from "@hangar/shared";

export type RegistrationSchema = Omit<SerializedProject,'id'|'repoUrl'|'contributors'|'judgeVisits'|'activeJudgeCount'|'createdAt'|'updatedAt'>
export interface RegistrationFormProps {
  initialValues?: RegistrationSchema;
  onSubmit?(): void;
}

export interface RegistrationFormProps {
  initialValues?: RegistrationSchema;
  onSubmit?(): void;
}

export type FormProps = (key:keyof RegistrationSchema,formik:FormikProps<RegistrationSchema>) =>
  InputProps | TextareaProps
