import React from 'react';
import { Schema } from '@hangar/shared';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { ZodFormattedError, z } from 'zod';
import { openErrorToast, openSuccessToast } from '../../utils/CustomToast';
import { useExpoJudgingSessionStore } from '../../../stores/expoJudgingSession';

type ExpoJudgingSessionValues = z.infer<typeof Schema.expoJudgingSession.post>;

export const useExpoJudgingSessionForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<
    ZodFormattedError<ExpoJudgingSessionValues> | undefined
  >();
  const [validateOnChange, setValidateOnChange] = React.useState(false);

  const formik = useFormik<ExpoJudgingSessionValues>({
    initialValues: {
      projectIds: [],
    },
    validateOnChange,
    validate: (values) => {
      const result = Schema.expoJudgingSession.post.safeParse(values);
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
        await useExpoJudgingSessionStore.getState().addExpoJudgingSession(values);
        void router.push('/admin/dashboard');
        openSuccessToast({ title: 'Judging session created' });
      } catch {
        openErrorToast({
          title: 'An error occurred.',
          description: 'Unable to create a new Expo Judging Session.',
        });
      }
      setIsLoading(false);
    },
  });

  React.useEffect(() => {
    setValidateOnChange(!!formik.submitCount);
  }, [formik.submitCount]);

  return { formik, errors, isLoading };
};
