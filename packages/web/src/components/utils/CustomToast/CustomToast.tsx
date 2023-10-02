import React from 'react';
import { useToast } from '@chakra-ui/react';
import { useCustomToast } from './useCustomToast';

export const CustomToast: React.FC = () => {
  const { toastValues } = useCustomToast();
  const showToast = useToast();

  React.useEffect(() => {
    // Whenever the value of `toastValues` changes, reopen the toast
    if (toastValues) {
      showToast(toastValues);
    }
  }, [showToast, toastValues]);

  return null;
};
