import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { ZodError } from 'zod';
import { Schema } from '@hangar/shared';
import { RegistrationFormProps, RegistrationSchema } from '.';

export const useRegistrationConfig = ({ initialValues, onSubmit }:RegistrationFormProps) => {
  const [serverError, setServerError] = useState(false);
  const [alertDescription, setAlertDescription] = useState('');
  const [validateWhileTyping, setValidateWhileTyping] = useState(false);
  
  const formik = useFormik<RegistrationSchema>({
    initialValues: initialValues ?? {
      name: '',
      description: '',
      location: '',
    },
    validate: (values) => {
      const errors: Partial<RegistrationSchema> = {};
      try {
        Schema.project.post.parse({
          name: values.name,
          description: values.description,
          location: values.location,
        })
      }
      catch (err) {
        const { constructor:{name}, errors:e } = err as ZodError;
        if (name==='ZodError') {
          e.forEach( (error) => {
            if (error.path) {
              errors[error.path[0] as keyof RegistrationSchema] = error.message;
            }
          });
        }
      }
      return errors;
    },
    async onSubmit(values) {
      const res = await fetch(`/api/project/${initialValues?.id ?? ''}`, {
        method: initialValues ? 'PUT' : 'POST',
        body: JSON.stringify({
          ...values,
          location: values.location!.trim(),
        }),
        headers:{ 'Content-Type': 'application/json' },
      });
    
      setServerError(!res.ok);
      setAlertDescription(res.ok
        ? 'You may close this modal now'
        : 'Something went wrong, please try again later...'
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
}