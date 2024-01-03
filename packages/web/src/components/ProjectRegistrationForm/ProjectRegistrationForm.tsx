/* eslint-disable max-lines */
/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import {
  Input,
  FormControl,
  VStack,
  FormLabel,
  Button,
  Textarea,
  InputProps,
  TextareaProps,
  useClipboard,
  Text,
} from '@chakra-ui/react';
import { Config } from '@hangar/shared';
import { RegistrationFormProps, useProjectRegistrationForm } from './useProjectRegistrationForm';
import { HintTooltip } from '../HintTooltip';
import { FormHelperHint } from '../Forms';

export type FormElementProps = {
  key: keyof ReturnType<typeof useProjectRegistrationForm>['formik']['values'];
  formik: ReturnType<typeof useProjectRegistrationForm>['formik'];
  errors: ReturnType<typeof useProjectRegistrationForm>['errors'];
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

export const ProjectRegistrationForm: React.FC<RegistrationFormProps> = ({
  project,
  onComplete,
}) => {
  const { formik, isLoading, errors } = useProjectRegistrationForm({
    project,
    onComplete,
  });

  // State to hold the contributors invite code
  const [contributorsInviteCode, setContributorsInviteCode] = useState<string>('');

  // Chakra UI hook to copy the invite code to the clipboard
  const { onCopy } = useClipboard(contributorsInviteCode);

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

        <FormControl id="contributorsInviteCode">
          <FormLabel>
            Contributors Invite Code
            <HintTooltip>
              This code is used to invite contributors to your project. You can copy it and send it
              to your contributors.
            </HintTooltip>
          </FormLabel>
          <Input
            value={contributorsInviteCode}
            onChange={(e) => setContributorsInviteCode(e.target.value)}
            variant="filled"
            type="text"
            isReadOnly
          />

          <Button onClick={onCopy}>Copy Invite Code</Button>

          <Text color="red.500" mt={2}>
            Warning: The contributor invite code will not be accessible again after closing this
            modal.
          </Text>
        </FormControl>

        <Button type="submit" isLoading={isLoading}>
          Submit
        </Button>
      </VStack>
    </form>
  );
};
