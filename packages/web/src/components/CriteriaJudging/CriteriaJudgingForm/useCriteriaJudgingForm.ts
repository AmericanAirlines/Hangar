import axios from 'axios';
import { CriteriaJudgingSession, Project, Schema } from '@hangar/shared';
import { useFormik } from 'formik';
import React from 'react';
import { ZodFormattedError, z } from 'zod';
import { useCustomToast } from '../../utils/CustomToast';

type CriteriaJudgingSubmissionValues = z.infer<typeof Schema.criteriaJudgingSubmission.post>;

type UseCriteriaJudgingFormProps = {
  criteriaJudgingSession: CriteriaJudgingSession;
  project: Project;
  onSubmissionComplete: () => void;
};

export const useCriteriaJudgingForm = ({
  criteriaJudgingSession,
  project,
  onSubmissionComplete,
}: UseCriteriaJudgingFormProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<ZodFormattedError<CriteriaJudgingSubmissionValues>>();
  const [validateOnChange, setValidateOnChange] = React.useState(false);

  const formik = useFormik<CriteriaJudgingSubmissionValues>({
    enableReinitialize: true,
    initialValues: {
      criteriaJudgingSession: criteriaJudgingSession.id,
      project: project.id,
      scores: criteriaJudgingSession.criteriaList.map((criteria) => ({
        criteria: criteria.id,
        score: '' as unknown as number,
      })),
    },
    validateOnChange,
    validate: (values) => {
      const result = Schema.criteriaJudgingSubmission.post.safeParse(values);

      if (result.success) {
        setErrors(undefined);
        return undefined;
      }
      setErrors(result.error.format());
      return { errorsExist: true };
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await axios.post('/api/criteriaJudgingSubmission', values);
        onSubmissionComplete();
        useCustomToast
          .getState()
          .openSuccessToast({ title: 'Criteria Judging Submission Created' });
      } catch (error) {
        useCustomToast
          .getState()
          .openErrorToast({ title: 'Failed to create criteria judging submission' });
      }
      setIsLoading(false);
    },
  });

  React.useEffect(() => {
    setValidateOnChange(!!formik.submitCount);
  }, [formik.submitCount]);

  return { formik, isLoading, errors };
};
