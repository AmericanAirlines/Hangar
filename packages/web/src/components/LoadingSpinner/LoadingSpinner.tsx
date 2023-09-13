import React from 'react';
import { Spinner, Stack } from '@chakra-ui/react';

export const LoadingSpinner = () => {
  return (
    <Stack direction="row">
      <Spinner size="lg"></Spinner>
    </Stack>
  );
};
