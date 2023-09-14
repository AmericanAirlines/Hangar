import React from 'react';
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
import { AlertResponse } from './AlertResponse';
import { useRegistrationConfig, RegistrationFormProps, formProps } from '.';

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ initialValues, onSubmit }) => {
  const { formik, alertDescription, alertProps } = useRegistrationConfig({ initialValues, onSubmit  })
  const { nameProps , descriptionProps , locationProps } = formProps(formik)
  return (
    <form onSubmit={formik.handleSubmit}>
      <VStack alignItems="stretch">
        
        <Alert status="info" rounded="2xl" marginBottom={8}>
          <AlertIcon />
          <AlertTitle mr={2}>
            Important
          </AlertTitle>
          <AlertDescription>
            You can come back and edit this after submitting
          </AlertDescription>
        </Alert>
        
        <FormControl id="name">
          <FormLabel>
            Name
          </FormLabel>
          <Input {...nameProps}/>
          <FormHelperText color="red.500">
            {formik.errors.name}&nbsp;
          </FormHelperText>
        </FormControl>
        
        <FormControl id="description">
          <FormLabel>
            Description
          </FormLabel>
          <Textarea {...descriptionProps} />
          <FormHelperText color="red.500">
            {formik.errors.description}&nbsp;
          </FormHelperText>
        </FormControl>
        
        <FormControl id="location">
          <FormLabel>
            Location
          </FormLabel>
          <Input {...locationProps} />
          <FormHelperText>
            Leave it blank if you don&apos;t know. You will be told this sometime before judging.
          </FormHelperText>
          <FormHelperText color="red.500">
            {formik.errors.location}&nbsp;
          </FormHelperText>
        </FormControl>
        
        <Button type="submit" className="btn btn-primary btn-block mb-5">
          Submit
        </Button>
        { (alertDescription === '')
          ? <></>
          : <AlertResponse {...alertProps} />
        }
      </VStack>
    </form>
  );
};
