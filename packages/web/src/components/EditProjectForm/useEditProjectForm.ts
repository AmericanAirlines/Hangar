import { Project, Schema } from '@hangar/shared';
import { useFormik } from 'formik';
import React from 'react';
import { z } from 'zod';

type EditProjectValues = z.infer<typeof Schema.project.put>;

type UseEditProjectFormProps = {
  project: Project;
};

export const useEditProjectForm = ({ project }: UseEditProjectFormProps) => {
  const [validateOnChange, setValidateOnChange] = React.useState(false);
  const { id, ...initialValues } = project;

  const formik = useFormik<EditProjectValues>({
    enableReinitialize: true,
    initialValues,
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

  return { formik: null, isLoading: false, errors: null };
};
