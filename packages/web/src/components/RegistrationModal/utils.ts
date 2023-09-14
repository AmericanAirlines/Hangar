import { FormikProps } from "formik";
import { InputProps, TextareaProps } from "@chakra-ui/react";

export type RegistrationSchema = {
  id?: string;
  name: string;
  description: string;
  location: string;
}

export interface RegistrationFormProps {
  initialValues?: {
    id: string;
    name: string;
    description: string;
    location: string;
  };
  onSubmit?(): void;
}

export interface FormPropsInterface {
  nameProps: InputProps,
  descriptionProps: TextareaProps,
  locationProps: InputProps,
}

export const formProps = (formik:FormikProps<RegistrationSchema>):FormPropsInterface => ({
  nameProps : {
    variant: "filled",
    type: "text",
    placeholder: "American Mac App",
    value: formik.values.name,
    isInvalid: !!formik.errors.name,
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    // disabled: formik.isSubmitting,
  },
  descriptionProps : {
    variant: "filled",
    // type: "text",
    placeholder: "With the new American Airlines Mac app, you get the information you need exactly when you need it. Curious about traffic to the airport? Wondering if a better seat is available? All this and more is at your fingertips.",
    value: formik.values.description,
    isInvalid: !!formik.errors.description,
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    // disabled: formik.isSubmitting,
  },
  locationProps : {
    variant: "filled",
    type: "text",
    placeholder: "42",
    value: formik.values.location,
    isInvalid: !!formik.errors.location,
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    // disabled: formik.isSubmitting,
  }
})
  