import React from 'react';
import { Schema } from '@hangar/shared';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { ZodFormattedError, z } from 'zod';
import { useCriteriaJudgingSessionStore } from '../../../stores/criteriaJudgingSession';
import { useCustomToast } from '../../utils/CustomToast';

type CriteriaJudgingSessionValues = z.infer<typeof Schema.criteriaJudgingSession.post>;

const blankCriteria: z.infer<typeof Schema.criteria.criteria> = {
  title: '',
  description: '',
  weight: 0,
  scaleMin: 1,
  scaleMax: 5,
  scaleDescription: '',
};

export const useCriteriaJudgingSessionFormStore = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<
    ZodFormattedError<CriteriaJudgingSessionValues> | undefined
  >();
  const [validateOnChange, setValidateOnChange] = React.useState(false);

  const formik = useFormik<CriteriaJudgingSessionValues>({
    initialValues: {
      title: '',
      description: '',
      criteriaList: [{ ...blankCriteria }],
    },
    validateOnChange,
    validate: (values) => {
      const result = Schema.criteriaJudgingSession.post.safeParse(values);
      if (result.success) {
        setErrors(undefined);
        return undefined;
      }
      setErrors(result.error.format());
      return { errorsExist: true };
    },
    onSubmit: async (values) => {
      // TODO: Make sure this is correctly formatted
      setIsLoading(true);
      const cjs = await useCriteriaJudgingSessionStore.getState().addCriteriaJudgingSession(values);
      if (!cjs) {
        setIsLoading(false);
      } else {
        void router.push('/admin/dashboard');
        useCustomToast.getState().openSuccessToast({ title: 'Judging session created' });
      }
    },
  });

  const addCriteria = () => {
    void formik.setFieldValue('criteriaList', [
      ...formik.values.criteriaList,
      { ...blankCriteria },
    ]);
  };

  const removeCriteria = (index: number) => {
    const updatedValues = [...formik.values.criteriaList];
    updatedValues.splice(index, 1);
    void formik.setFieldValue('criteriaList', updatedValues);
  };

  React.useEffect(() => {
    setValidateOnChange(!!formik.submitCount);
  }, [formik.submitCount]);

  return { formik, errors, isLoading, addCriteria, removeCriteria };
};
