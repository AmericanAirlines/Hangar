/* eslint-disable max-lines */
/* eslint-disable no-underscore-dangle */
import { useContext } from 'react';
import { Flex, FormControl, FormLabel, Input, Link, Text, Textarea } from '@chakra-ui/react';
import { Schema } from '@hangar/shared';
import { useCriteriaJudgingSessionFormStore } from '../useCriteriaJudgingSessionForm';
import { FormHelperHint } from '../../../Forms';
import { FormStyleContext } from '../FormStyleContext';
import { colors } from '../../../../theme';

export type CriteriaFieldsProps = ReturnType<typeof useCriteriaJudgingSessionFormStore> & {
  index: number;
};

export const CriteriaFields: React.FC<CriteriaFieldsProps> = ({
  formik,
  errors,
  isLoading,
  index,
  removeCriteria,
}) => {
  const criteria = formik.values.criteriaList[index];
  const { inputStyleProps } = useContext(FormStyleContext);

  return (
    <Flex px={5} direction="column" rounded="lg" bgColor={colors.brandPrimaryDark} py={3} gap={1}>
      <FormControl id={`criteriaList[${index}].title`}>
        <FormLabel>
          <Flex justifyContent="space-between">
            Title
            <Link
              hidden={
                formik.values.criteriaList.length ===
                Schema.criteriaJudgingSession.PostValidation.MIN_CRITERIA
              }
              fontSize="sm"
              color={colors.muted}
              onClick={() => removeCriteria(index)}
            >
              Remove Criteria
            </Link>
          </Flex>
        </FormLabel>
        <Input
          disabled={isLoading}
          value={criteria?.title}
          {...inputStyleProps}
          onChange={formik.handleChange}
        />
        <FormHelperHint error={errors?.criteriaList?.[index]?.title?._errors} />
      </FormControl>

      <FormControl id={`criteriaList[${index}].description`}>
        <FormLabel>
          <Flex gap={3}>
            Description <Text color={colors.muted}>Optional</Text>
          </Flex>
        </FormLabel>
        <Textarea
          disabled={isLoading}
          value={criteria?.description}
          {...inputStyleProps}
          onChange={formik.handleChange}
        />
        <FormHelperHint error={errors?.criteriaList?.[index]?.description?._errors} />
      </FormControl>

      <FormControl id={`criteriaList[${index}].weight`}>
        <FormLabel>Weight</FormLabel>
        <Input
          disabled={isLoading}
          value={criteria?.weight}
          {...inputStyleProps}
          onChange={formik.handleChange}
        />
        <FormHelperHint
          error={errors?.criteriaList?.[index]?.weight?._errors}
          hint={`A number representing the weight of this criteria vs others; must be between ${Schema.criteria.Validation.WEIGHT_MIN} and ${Schema.criteria.Validation.WEIGHT_MAX}`}
        />
      </FormControl>

      <FormControl id={`criteriaList[${index}].scaleMin`}>
        <FormLabel>Scale Minimum</FormLabel>
        <Input
          disabled={isLoading}
          value={criteria?.scaleMin}
          {...inputStyleProps}
          onChange={formik.handleChange}
        />
        <FormHelperHint
          error={errors?.criteriaList?.[index]?.scaleMin?._errors}
          hint={`A number representing the lowest score for this criteria`}
        />
      </FormControl>

      <FormControl id={`criteriaList[${index}].scaleMax`}>
        <FormLabel>Scale Maximum</FormLabel>
        <Input
          disabled={isLoading}
          value={criteria?.scaleMax}
          {...inputStyleProps}
          onChange={formik.handleChange}
        />
        <FormHelperHint
          error={errors?.criteriaList?.[index]?.scaleMax?._errors}
          hint={`A number representing the highest score for this criteria`}
        />
      </FormControl>

      <FormControl id={`criteriaList[${index}].scaleDescription`}>
        <FormLabel>
          <Flex gap={3}>
            Scale Description <Text color={colors.muted}>Optional</Text>
          </Flex>
        </FormLabel>
        <Textarea
          disabled={isLoading}
          value={criteria?.scaleDescription}
          {...inputStyleProps}
          onChange={formik.handleChange}
        />
        <FormHelperHint
          error={errors?.criteriaList?.[index]?.scaleDescription?._errors}
          hint="An explanation to judges for how to score between your minimum and maximum value"
        />
      </FormControl>
    </Flex>
  );
};
