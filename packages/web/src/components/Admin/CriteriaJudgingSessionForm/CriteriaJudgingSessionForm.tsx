/* eslint-disable no-underscore-dangle */
import { Button, Flex, FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react';
import React from 'react';
import { useCriteriaJudgingSessionFormStore } from './useCriteriaJudgingSessionForm';
import { FormHelperHint } from '../../Forms';
import { CriteriaList } from './CriteriaList';
import { FormStyleContext, FormStyleContextValues } from './formStyleContext';

type CriteriaJudgingSessionFormProps = {};

export const CriteriaJudgingSessionForm: React.FC<CriteriaJudgingSessionFormProps> = () => {
  const { isLoading, formik, errors, ...rest } = useCriteriaJudgingSessionFormStore();
  const style: FormStyleContextValues = {
    inputStyleProps: {
      variant: 'filled',
      isDisabled: isLoading,
    },
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormStyleContext.Provider value={style}>
        <Flex w="full" direction="column" gap={5}>
          <FormControl id="title">
            <FormLabel>Title</FormLabel>
            <Input
              {...style.inputStyleProps}
              value={formik.values.title}
              onChange={formik.handleChange}
            />
            <FormHelperHint
              error={errors?.title?._errors}
              hint={'A meaningful title for your judging session'}
            />
          </FormControl>

          <FormControl id="description">
            <FormLabel>Description</FormLabel>
            <Textarea
              {...style.inputStyleProps}
              value={formik.values.description}
              onChange={formik.handleChange}
            />
            <FormHelperHint
              error={errors?.description?._errors}
              hint={'The purpose of the judging session'}
            />
          </FormControl>

          <CriteriaList formik={formik} errors={errors} isLoading={isLoading} {...rest} />

          <Button type="submit" isLoading={isLoading}>
            Submit
          </Button>
        </Flex>
      </FormStyleContext.Provider>
    </form>
  );
};
