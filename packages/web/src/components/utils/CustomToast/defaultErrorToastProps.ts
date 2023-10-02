import { UseToastOptions } from '@chakra-ui/react';

export const defaultErrorToastProps: UseToastOptions = {
  status: 'error',
  position: 'top',
  duration: 30 * 1000,
  isClosable: true,
};
