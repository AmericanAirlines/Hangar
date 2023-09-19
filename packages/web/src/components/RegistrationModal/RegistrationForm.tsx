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
import { useRegistrationConfig } from './useRegistrationConfig';
import { RegistrationFormProps, FormProps, RegistrationSchema, RegistrationFormik } from './utils';
import { Hint } from './HintTooltip';
import { statusColors } from '../../theme/colors';

const handleBlur = async (e: React.FocusEvent<HTMLInputElement>, formik: RegistrationFormik) => {
  const values =  {
    [e.target.id]: e.target.value,
    // if any outstanding validation errors exist, add them to be validated
    ...(Object.entries(formik.errors).map(([ key ]) => {
      const value = formik.values[key as keyof RegistrationSchema];
      return ({ [key]: value })
    }).reduce((acc, curr) => ({ ...acc, ...curr }), {})),
  }
  await formik.validateForm( values );
}
const formProps: FormProps = (key, formik) => ({
  variant: "filled",
  type: "text",
  value: formik.values[key],
  isInvalid: !!formik.errors[key],
  onChange: formik.handleChange,
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => handleBlur(e, formik),
});

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ initialValues, onSubmit }) => {
  const { formik, alertDescription, alertProps } = useRegistrationConfig({ initialValues, onSubmit  })
  return (
    <Box>
      <form onSubmit={formik.handleSubmit}>
        <VStack alignItems="stretch">
          
          <FormControl id="name">
            <FormLabel>
              Name
              <Hint> A descriptive title for your app </Hint>
            </FormLabel>
            <Input {...formProps('name',formik) as InputProps} />
            <FormHelperText color={statusColors.error}>
              {formik.errors.name}&nbsp;
            </FormHelperText>
          </FormControl>
          
          <FormControl id="description">
            <FormLabel>
              Description
              <Hint> A detailed description of what your project does, why it was built, and who will use it. </Hint>
            </FormLabel>
            <Textarea {...formProps('description',formik) as TextareaProps} />
            <FormHelperText color={statusColors.error}>
              {formik.errors.description}&nbsp;
            </FormHelperText>
          </FormControl>
          
          <FormControl id="location">
            <FormLabel>
              Location
            </FormLabel>
            <Input {...formProps('location',formik) as InputProps} />
            <FormHelperText color={statusColors.error}>
              {formik.errors.location}&nbsp;
            </FormHelperText>
          </FormControl>

          <FormControl id="repoUrl">
            <FormLabel>
              Repository URL
              <Hint> Provide a full url including https </Hint>
            </FormLabel>
            <Input {...formProps('repoUrl',formik) as InputProps} />
            <FormHelperText color={statusColors.error}>
              {formik.errors.repoUrl}&nbsp;
            </FormHelperText>
          </FormControl>
          
          <Button type="submit"> Submit </Button>
          { (alertDescription !== '') && <AlertResponse {...alertProps} /> }
        </VStack>
      </form>
    </Box>
  );
};
