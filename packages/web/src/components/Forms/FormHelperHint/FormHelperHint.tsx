import { FormHelperText } from '@chakra-ui/react';
import React from 'react';
import { colors, statusColors } from '../../../theme';

type FormHelperHintProps = {
  hint?: string;
  error?: string | string[];
};

export const FormHelperHint: React.FC<FormHelperHintProps> = ({ hint, error: errors }) => {
  // TODO: Support displaying multiple errors if they exist
  const error = Array.isArray(errors) ? (errors[0] as string) : errors ?? null;

  return (
    <FormHelperText color={error ? statusColors.error : colors.muted} whiteSpace="pre-wrap">
      {error ?? hint}&nbsp;
    </FormHelperText>
  );
};
