import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import axios, { isAxiosError } from 'axios';
import { Schema } from '@hangar/shared';
import { RegistrationFormProps, RegistrationSchema } from './utils';
import { openErrorToast, openSuccessToast } from '../utils/CustomToast';
import { useUserStore } from '../../stores/user';

export const useRegistrationConfig = ({ onSubmit }: RegistrationFormProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [validateWhileTyping, setValidateWhileTyping] = useState(false);

  const formik = useFormik<RegistrationSchema>({
    initialValues: {
      name: '',
      description: '',
      location: '',
      repoUrl: '',
    },
    validateOnChange: validateWhileTyping,
    validateOnBlur: true,
    validate: (values) => {
      const errors: Partial<RegistrationSchema> = {};
      const parsed = Schema.project.post.safeParse(values);

      if (!parsed.success) {
        parsed.error.issues.forEach((issue) => {
          if (issue.path && (issue.path[0] as string) in values) {
            errors[issue.path[0] as keyof RegistrationSchema] = issue.message;
          }
        });
      }

      return errors;
    },
    async onSubmit(values) {
      try {
        setIsLoading(true);
        await axios(`/api/project`, {
          method: 'POST',
          data: JSON.stringify({
            ...values,
            location: (values?.location ?? '').trim(),
          }),
          headers: { 'Content-Type': 'application/json' },
        });
        openSuccessToast({ title: 'Project Registered', description: "You're all set! 🚀" });
        await useUserStore.getState().fetchUser(); // Refresh user to populate project
        onSubmit?.();
      } catch (error) {
        let errorMessage = isAxiosError(error) ? error.response?.data : '';
        if (isAxiosError(error)) {
          switch (error.response?.status) {
            case 409:
              errorMessage = 'Project already exists for user';
              break;
            default:
          }
        }
        openErrorToast({
          title: 'Failed to create project',
          description: errorMessage,
        });
      }
      setIsLoading(false);
    },
  });

  useEffect(() => {
    if (formik.submitCount && !validateWhileTyping) {
      setValidateWhileTyping(true);
    }
  }, [formik.submitCount, validateWhileTyping]);

  return { formik, isLoading };
};
