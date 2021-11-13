import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import {
  Input,
  FormControl,
  VStack,
  FormHelperText,
  FormLabel,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Button,
  Textarea,
} from '@chakra-ui/react';

interface RegistrationFormProps {
  initialValues?: {
    name: string;
    description: string;
    tableNumber: string;
  };
}

type RegistrationSchema = yup.InferType<typeof registrationSchema>;
const registrationSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string(),
  tableNumber: yup.string(),
});

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ initialValues }) => {
  const [serverError, setServerError] = useState('');
  const [validateWhileTyping, setValidateWhileTyping] = React.useState(false);

  const formik = useFormik<RegistrationSchema>({
    initialValues: initialValues ?? {
      name: '',
      description: '',
      tableNumber: '',
    },
    validationSchema: registrationSchema,
    validateOnBlur: validateWhileTyping,
    validateOnChange: validateWhileTyping,
    async onSubmit(values) {
      const res = await fetch('/api/projects/', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        setServerError('Something went wrong, please try again later...');
      }
    },
  });

  useEffect(() => {
    if (formik.submitCount && !validateWhileTyping) {
      setValidateWhileTyping(true);
    }
  }, [formik.submitCount, validateWhileTyping]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <VStack alignItems="stretch">
        <FormControl id="name">
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            placeholder="American Mac App"
            value={formik.values.name}
            isInvalid={!!formik.errors.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting}
          />
          <FormHelperText color="red.500">{formik.errors.name}&nbsp;</FormHelperText>
        </FormControl>
        <FormControl id="description">
          <FormLabel>Description</FormLabel>

          <Textarea
            type="text"
            placeholder="With the new American Airlines Mac app, you get the information you need exactly when you need it. Curious about traffic to the airport? Wondering if a better seat is available? All this and more is at your fingertips."
            value={formik.values.description}
            isInvalid={!!formik.errors.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting}
          />
          <FormHelperText color="red.500">{formik.errors.description}&nbsp;</FormHelperText>
        </FormControl>
        <FormControl id="tableNumber">
          <FormLabel>Table Number</FormLabel>
          <Input
            type="text"
            placeholder="42"
            value={formik.values.tableNumber}
            isInvalid={!!formik.errors.tableNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting}
          />
          <FormHelperText color="red.500">{formik.errors.tableNumber}&nbsp;</FormHelperText>
        </FormControl>
        <Button type="submit" className="btn btn-primary btn-block mb-5">
          Submit
        </Button>
        {serverError !== '' ? (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle mr={2}>Uh oh</AlertTitle>
            <AlertDescription>{serverError}</AlertDescription>
            <CloseButton
              position="absolute"
              right="8px"
              top="8px"
              onClick={() => setServerError('')}
              data-testid="alert-close-button"
            />
          </Alert>
        ) : null}
      </VStack>
    </form>
  );
};
