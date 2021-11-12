import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
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

interface ProjectProps {
  name?: string;
  description?: string;
  tableNumber?: number;
}

export const RegistrationForm: React.FC = () => {
  const [serverError, setServerError] = useState('');
  const [project, setProject] = useState<ProjectProps>({});
  const [validateWhileTyping, setValidateWhileTyping] = React.useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      // todo default endpoint that user req.user to find the user's project/team
      const res = await fetch('/api/project/');

      try {
        if (!res.ok) {
          throw new Error();
        }

        const data = await res.json();
        setProject(data);
      } catch (err) {
        alert(`Something went wrong, while trying to load your project ${res.statusText}`);
      }
    };

    void fetchProject();
  }, []);

  const RegistrationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string(),
    tableNumber: Yup.number().typeError('Table number must be an integer'),
  });

  const formik = useFormik({
    initialValues: {
      name: project.name,
      description: project.description,
      tableNumber: project.tableNumber,
    },
    validationSchema: RegistrationSchema,
    validateOnBlur: validateWhileTyping,
    validateOnChange: validateWhileTyping,
    async onSubmit(values) {
      const res = await fetch('/api/projects/', {
        method: 'POST',
        body: JSON.stringify({
          inputConfig: values,
        }),
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
            value={formik.values.name ?? project.name}
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
            value={formik.values.description ?? project.description}
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
            value={formik.values.tableNumber ?? project.tableNumber}
            isInvalid={!!formik.errors.tableNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting}
          />
          <FormHelperText color="red.500">{formik.errors.tableNumber}&nbsp;</FormHelperText>
        </FormControl>
        <Button type="submit" className="btn btn-primary btn-block mb-5" lo>
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
