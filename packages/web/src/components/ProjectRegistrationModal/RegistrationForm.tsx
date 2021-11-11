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
    const fetchProjects = async () => {
      // todo default endpoint that user req.user to find the user's project/team
      const res = await fetch('/api/project/');

      try {
        if (!res.ok) {
          throw new Error();
        }

        const data = await res.json();
        setProject(data);
      } catch (err) {
        // TODO print/log error message to show we were unable to pull their project data
        setProject({});
      }
    };

    void fetchProjects();
  }, []);

  const RegistrationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string(),
    tableNumber: Yup.number(),
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
      const res = await fetch('/api/project/register', {
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
            placeholder="Your project name"
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
          <Input
            type="text"
            placeholder="My project will..."
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
            placeholder="Enter value..."
            value={formik.values.tableNumber ?? project.tableNumber}
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
