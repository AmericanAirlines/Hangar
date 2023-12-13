/* eslint-disable no-underscore-dangle */
import React from 'react';
import {
  Input,
  FormControl,
  VStack,
  FormLabel,
  Button,
  Textarea,
  InputProps,
  TextareaProps,
} from '@chakra-ui/react';
import { Config } from '@hangar/shared';
import { RegistrationFormProps, useRegistrationConfig } from './useRegistrationConfig';
import { HintTooltip } from '../HintTooltip';
import { FormHelperHint } from '../Forms';

export type FormElementProps = {
  key: keyof ReturnType<typeof useRegistrationConfig>['formik']['values'];
  formik: ReturnType<typeof useRegistrationConfig>['formik'];
  errors: ReturnType<typeof useRegistrationConfig>['errors'];
};

const formElementProps: (props: FormElementProps) => InputProps | TextareaProps = ({
  key,
  formik,
  errors,
}) => ({
  variant: 'filled',
  type: 'text',
  value: formik.values[key],
  isInvalid: !!errors?.[key],
  onChange: formik.handleChange,
});

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ project, onComplete }) => {
  const { formik, isLoading, errors } = useRegistrationConfig({
    project,
    onComplete,
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <VStack alignItems="stretch">
        <FormControl id="name">
          <FormLabel>
            Name
            <HintTooltip>A descriptive title for your app</HintTooltip>
          </FormLabel>
          <Input {...(formElementProps({ key: 'name', formik, errors }) as InputProps)} />
          <FormHelperHint error={errors?.name?._errors} />
        </FormControl>

        <FormControl id="description">
          <FormLabel>
            Description
            <HintTooltip>
              A detailed description of what your project does, why it was built, and who will use
              it.
            </HintTooltip>
          </FormLabel>
          <Textarea
            {...(formElementProps({ key: 'description', formik, errors }) as TextareaProps)}
          />
          <FormHelperHint error={errors?.description?._errors} />
        </FormControl>

        <FormControl id="location">
          <FormLabel>{Config.project.locationLabel}</FormLabel>
          <Input {...(formElementProps({ key: 'location', formik, errors }) as InputProps)} />
          <FormHelperHint error={errors?.location?._errors} />
        </FormControl>

        <FormControl id="repoUrl">
          <FormLabel>
            Repository URL
            <HintTooltip>Provide a full url including https</HintTooltip>
          </FormLabel>
          <Input {...(formElementProps({ key: 'repoUrl', formik, errors }) as InputProps)} />
          <FormHelperHint error={errors?.repoUrl?._errors} />
        </FormControl>

        <Button type="submit" isLoading={isLoading}>
          Submit
        </Button>
      </VStack>
    </form>
  );
};
