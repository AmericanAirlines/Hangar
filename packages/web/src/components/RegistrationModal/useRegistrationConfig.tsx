import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { ZodError } from 'zod';
import { Schema } from '@hangar/shared';
import { RegistrationFormProps, RegistrationSchema } from './utils';

export const useRegistrationConfig = ({ onSubmit }:RegistrationFormProps) => {
  const [serverError, setServerError] = useState(false);
  const [alertDescription, setAlertDescription] = useState('');
  const [validateWhileTyping, setValidateWhileTyping] = useState(false);
  
  const formik = useFormik<RegistrationSchema>({
    initialValues: {
      name: '',
      description: '',
      location: '',
    },
    validate: (values) => {
      const errors: Partial<RegistrationSchema> = {};
      const p = Schema.project.post.safeParse({
        name: values.name,
        description: values.description,
        location: values.location,
      })
      console.log(p.error.issues[0].message)
      // console.log(p.error)
      // try {
      //   console.log({x})
      // }
      // catch (err) {
      //   const { constructor:{name}, errors:e } = err as ZodError;
      //   if (name==='ZodError') {
      //     e.forEach( (error) => {
      //       if (error.path) {
      //         errors[error.path[0] as keyof RegistrationSchema] = error.message;
      //       }
      //     });
      //   }
      // }
      return errors;
    },
    async onSubmit(values) {
      const res = await fetch(`/api/project/`, {
        method: 'POST',
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