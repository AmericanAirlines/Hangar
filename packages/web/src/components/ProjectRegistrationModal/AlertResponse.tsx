import { Alert, AlertDescription, AlertIcon, AlertTitle, CloseButton } from '@chakra-ui/react';
import React from 'react';

interface AlertResponseProps {
  error: boolean;
  description: string;
  closeAlert: () => void;
}

export const AlertResponse: React.FC<AlertResponseProps> = ({ error, description, closeAlert }) => (
  <Alert status={error ? 'error' : 'success'}>
    <AlertIcon />
    <AlertTitle mr={2}>{error ? 'Uh oh' : 'Success'}</AlertTitle>
    <AlertDescription>{description}</AlertDescription>
    <CloseButton
      position="absolute"
      right="0px"
      top="0px"
      onClick={() => closeAlert()}
      data-testid="alert-close-button"
    />
  </Alert>
);
