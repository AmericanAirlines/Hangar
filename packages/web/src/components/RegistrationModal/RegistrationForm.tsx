import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import {
  Input,
  FormControl,
  VStack,
  FormHelperText,
  FormLabel,
  Button,
  Textarea,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react';
import { AlertResponse } from '.';

export interface RegistrationFormProps {
  initialValues?: {
    id: string;
    name: string;
    description: string;
    tableNumber: string;
  };
  onSubmit?(): void;
}

type RegistrationSchema = yup.InferType<typeof registrationSchema>;
const registrationSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  tableNumber: yup.string(),
});

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ initialValues, onSubmit }) => {
  const [serverError, setServerError] = useState(false);
  const [alertDescription, setAlertDescription] = useState('');
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
      let res: Response;

      const fetchBody = JSON.stringify({
        ...values,
        tableNumber: values.tableNumber!.trim(),
      });

      if (initialValues) {
        res = await fetch(`/api/projects/${initialValues.id}`, {
          method: 'PUT',
          body: fetchBody,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        res = await fetch('/api/projects/', {
          method: 'POST',
          body: fetchBody,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
      if (!res.ok) {
        setServerError(true);
        setAlertDescription('Something went wrong, please try again later...');
      } else {
        setServerError(false);
        setAlertDescription('You may close this modal now');
        onSubmit?.();
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
        <Alert status="info" rounded="2xl" marginBottom={8}>
          <AlertIcon />
          <AlertTitle mr={2}>Important</AlertTitle>
          <AlertDescription>You can come back and edit this after submitting</AlertDescription>
        </Alert>
        <FormControl id="name">
          <FormLabel>Name</FormLabel>
          <Input
            variant="filled"
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
            variant="filled"
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
            variant="filled"
            type="text"
            placeholder="42"
            value={formik.values.tableNumber}
            isInvalid={!!formik.errors.tableNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting}
          />
          <FormHelperText>
            Leave it blank if you don&apos;t know. You will be told this sometime before judging.
          </FormHelperText>
          <FormHelperText color="red.500">{formik.errors.tableNumber}&nbsp;</FormHelperText>
        </FormControl>
        <Button type="submit" className="btn btn-primary btn-block mb-5">
          Submit
        </Button>
        {alertDescription !== '' ? (
          <AlertResponse
            error={serverError}
            description={alertDescription}
            closeAlert={() => setAlertDescription('')}
          />
        ) : null}
      </VStack>
    </form>
  );
};
