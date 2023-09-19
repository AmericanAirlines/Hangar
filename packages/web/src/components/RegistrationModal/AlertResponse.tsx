import React from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Spacer,
} from '@chakra-ui/react';

interface AlertResponseProps {
  error: boolean;
  description: string;
  closeAlert: () => void;
}

export const AlertResponse: React.FC<AlertResponseProps> = ({ error, description, closeAlert }) => (
  <Alert status={error ? 'error' : 'success'} rounded="2xl">
    <AlertIcon />

    <AlertTitle mr={2}>{error ? 'Uh oh' : 'Success'}</AlertTitle>

    <AlertDescription>{description}</AlertDescription>

    <Spacer />
    <CloseButton onClick={() => closeAlert()} />
  </Alert>
);
