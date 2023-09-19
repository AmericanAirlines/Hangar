import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { Schema } from '@hangar/shared';
import { RegistrationFormProps, RegistrationSchema } from './utils';

export const useRegistrationConfig = ({ onSubmit }: RegistrationFormProps) => {
  const [serverError, setServerError] = useState(false);
  const [alertDescription, setAlertDescription] = useState('');
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
      const res = await fetch(`/api/project/`, {
        method: 'POST',
        body: JSON.stringify({
          ...values,
          location: values.location!.trim(),
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      setServerError(!res.ok);
      setAlertDescription(
        res.ok ? 'You may close this modal now' : 'Something went wrong, please try again later...',
      );
      if (res.ok && onSubmit) {
        onSubmit();
      }
    },
  });

  const alertProps = {
    error: serverError,
    description: alertDescription,
    closeAlert: () => setAlertDescription(''),
  };

  useEffect(() => {
    if (formik.submitCount && !validateWhileTyping) {
      setValidateWhileTyping(true);
    }
  }, [formik.submitCount, validateWhileTyping]);

  return { formik, alertDescription, alertProps };
};
