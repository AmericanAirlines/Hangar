import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Input,
  Button,
  Box,
  Heading,
  VStack,
  Text,
  FormControl,
  FormHelperText,
  FormLabel,
  Alert,
  AlertTitle,
  AlertIcon,
} from '@chakra-ui/react';

type OnboardingFormValues = yup.InferType<typeof onboardingFormSchema>;
const onboardingFormSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
  email: yup
    .string()
    .trim()
    .email('Must be a valid email')
    .matches(/edu$/i, { message: 'Email must be a student email ending in .edu' })
    .required('Student email is required'),
});

const OnboardingPage: React.FC = () => {
  const [errorText, setErrorText] = React.useState<string | undefined>(undefined);
  const [isRedirecting, setIsRedirecting] = React.useState(false);
  const [validateWhileTyping, setValidateWhileTyping] = React.useState(false);

  const formik = useFormik<OnboardingFormValues>({
    initialValues: {
      name: '',
      email: '',
    },
    validationSchema: onboardingFormSchema,
    validateOnBlur: validateWhileTyping,
    validateOnChange: validateWhileTyping,
    async onSubmit({ name, email }) {
      setErrorText(undefined);

      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        setErrorText(text);
        return;
      }

      setIsRedirecting(true);

      window.location.href = '/app';
    },
  });

  React.useEffect(() => {
    if (formik.submitCount && !validateWhileTyping) {
      setValidateWhileTyping(true);
    }
  }, [formik.submitCount, validateWhileTyping]);

  return (
    <VStack mt={10} spacing={10} alignItems="stretch">
      <Box maxWidth="500px" width="100%" mx="auto">
        <Heading textAlign="center">Welcome to Hangar 👋</Heading>
        <Text textAlign="center">Before we get started, we need just a little more info 👇</Text>
      </Box>

      <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
        <VStack maxWidth="500px" width="100%" mx="auto">
          <FormControl id="name">
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              autoComplete="off"
              placeholder="Some Hacker"
              disabled={formik.isSubmitting}
              value={formik.values.name}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.name}
            />
            <FormHelperText>What&apos;s your full name?</FormHelperText>
            <FormHelperText color="red.400">{formik.errors.name}&nbsp;</FormHelperText>
          </FormControl>

          <FormControl id="email">
            <FormLabel>Student Email</FormLabel>
            <Input
              type="email"
              autoComplete="off"
              placeholder="first.last@school.edu"
              disabled={formik.isSubmitting}
              value={formik.values.email}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.email}
            />
            <FormHelperText>What&apos;s your student email?</FormHelperText>
            <FormHelperText color="red.400">{formik.errors.email}&nbsp;</FormHelperText>
          </FormControl>
          <Button type="submit" isLoading={formik.isSubmitting || isRedirecting}>
            Submit
          </Button>
          {errorText ? (
            <Alert status="error" rounded="2xl">
              <AlertIcon />
              <AlertTitle mr={2}>{errorText}</AlertTitle>
            </Alert>
          ) : null}
        </VStack>
      </form>
    </VStack>
  );
};

export default OnboardingPage;
