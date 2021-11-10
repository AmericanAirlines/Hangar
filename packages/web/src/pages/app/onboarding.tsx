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

// TODO: Test to see if asdasd90@edu is valid

const OnboardingPage: React.FC = () => {
  const [errorText, setErrorText] = React.useState<string | undefined>(undefined);
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

      window.location.href = '/app';
    },
  });

  if (formik.submitCount && !validateWhileTyping) {
    setValidateWhileTyping(true);
  }

  return (
    <VStack mt={10} spacing={10}>
      <Box>
        <Heading>Welcome to Hangar 👋</Heading>
        <Text>Before we get started, we need just a little more info 👇</Text>
      </Box>

      <form
        style={{
          minWidth: '20%',
        }}
        onSubmit={formik.handleSubmit}
        onReset={formik.handleReset}
      >
        <VStack minWidth={10} alignItems="flex-end">
          <FormControl id="name">
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              id="name"
              type="text"
              name="name"
              autoComplete="off"
              placeholder="Some Hacker"
              disabled={formik.isSubmitting}
              value={formik.values.name}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.name}
            />
            <FormHelperText>What&apos;s your full name?</FormHelperText>
            <FormHelperText color="red.400">{formik.errors.name}&nbsp;</FormHelperText>

            <FormLabel htmlFor="email">Student Email</FormLabel>
            <Input
              id="email"
              type="email"
              name="email"
              autoComplete="off"
              placeholder="learn.stuff@school.edu"
              disabled={formik.isSubmitting}
              value={formik.values.email}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.email}
            />
            <FormHelperText>What&apos;s your student email?</FormHelperText>
            <FormHelperText color="red.400">{formik.errors.email}&nbsp;</FormHelperText>
          </FormControl>
          <Button type="submit" isLoading={formik.isSubmitting}>
            Submit
          </Button>
        </VStack>
      </form>
      {errorText ? <Heading color="red.500"> {errorText} </Heading> : null}
    </VStack>
  );
};

export default OnboardingPage;
