import React from 'react';
import {
  Input,
  FormControl,
  VStack,
  FormHelperText,
  FormLabel,
  Box,
  Button,
  Textarea,
  InputProps,
  TextareaProps,
} from '@chakra-ui/react';
import { AlertResponse } from './AlertResponse';
// import { useRegistrationConfig, RegistrationFormProps, FormProps } from '.';
import { useRegistrationConfig } from './useRegistrationConfig';
import { RegistrationFormProps, FormProps } from './utils';
import { Hint } from './HintTooltip';
import { statusColors } from '../../theme/colors';

export const formProps:FormProps = (key,formik) => ({
  variant: "filled",
  type: "text",
  value: formik.values[key],
  isInvalid: !!formik.errors[key],
  onChange: formik.handleChange,
  onBlur: formik.handleBlur,
});

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ initialValues, onSubmit }) => {
  const { formik, alertDescription, alertProps } = useRegistrationConfig({ initialValues, onSubmit  })
  const nameProps = formProps('name',formik) as InputProps;
  const descriptionProps = formProps('description',formik) as TextareaProps;
  const locationProps = formProps('location',formik) as InputProps;

  return (
    <Box>
      <form onSubmit={formik.handleSubmit}>
        <VStack alignItems="stretch">
          
          <FormControl id="name">
            <FormLabel>
              Name
              <Hint>
                A descriptive title for your app"
              </Hint>
            </FormLabel>
            <Input {...nameProps} />
            <FormHelperText color={statusColors.error}>
              {formik.errors.name}&nbsp;
            </FormHelperText>
          </FormControl>
          
          <FormControl id="description">
            <FormLabel>
              Description
              <Hint>
                A detailed description of what your project does, why it was built, and who will use it.
              </Hint>
            </FormLabel>
            <Textarea {...descriptionProps} />
            <FormHelperText color={statusColors.error}>
              {formik.errors.description}&nbsp;
            </FormHelperText>
          </FormControl>
          
          <FormControl id="location">
            <FormLabel>
              Location
            </FormLabel>
            <Input {...locationProps} />
            <FormHelperText color={statusColors.error}>
              {formik.errors.location}&nbsp;
            </FormHelperText>
          </FormControl>
          
          <Button type="submit">
            Submit
          </Button>
          { (alertDescription !== '') && <AlertResponse {...alertProps} /> }
        </VStack>
      </form>
    </Box>
  );
};
