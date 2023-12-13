/* eslint-disable no-underscore-dangle */
import { Button, Flex, FormControl, FormLabel } from '@chakra-ui/react';
import React from 'react';
import { useExpoJudgingSessionForm } from './useExpoJudgingSessionForm';
import { ProjectsSelect } from '../../ProjectsSelect';
import { FormHelperHint } from '../../Forms';

type ExpoJudgingSessionFormProps = {};

export const ExpoJudgingSessionForm: React.FC<ExpoJudgingSessionFormProps> = () => {
  const { isLoading, formik, errors } = useExpoJudgingSessionForm();
  // const inputStyleProps: Pick<InputProps | TextareaProps, 'variant' | 'isDisabled'> = {
  //   variant: 'filled',
  //   isDisabled: isLoading,
  // };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex w="full" direction="column" gap={5}>
        {/* <FormControl id="title">
          <FormLabel>Title</FormLabel>
          <Input {...inputStyleProps} value={formik.values.title} onChange={formik.handleChange} />
          <FormHelperHint
            error={errors?.title?._errors}
            hint={'A meaningful title for your judging session'}
          />
        </FormControl>

        <FormControl id="description">
          <FormLabel>Description</FormLabel>
          <Textarea
            {...inputStyleProps}
            value={formik.values.description}
            onChange={formik.handleChange}
          />
          <FormHelperHint
            error={errors?.description?._errors}
            hint={'The purpose of the judging session'}
          />
        </FormControl> */}

        <FormControl id="projects">
          <FormLabel>Projects</FormLabel>
          <ProjectsSelect
            onChange={(projects) => {
              void formik.setFieldValue(
                'projectIds',
                projects.map((p) => p.id),
              );
            }}
            isInvalid={!!errors?.projectIds?._errors.length}
          />
          <FormHelperHint
            error={errors?.projectIds?._errors}
            hint={'Select the projects that judges will visit'}
          />
        </FormControl>

        <Button type="submit" isLoading={isLoading}>
          Submit
        </Button>
      </Flex>
    </form>
  );
};
