import React from 'react';
import axios from 'axios';
import { Button, UseToastOptions, useToast } from '@chakra-ui/react';
import { ExpoJudgingSession } from '@hangar/shared';

const SUCCESS_POST_TOAST: UseToastOptions = {
  title: 'Success!',
  description: 'Expo Judging Session successfully created.',
  status: 'success',
  duration: 3000,
  isClosable: true,
};

const FAILED_POST_TOAST: UseToastOptions = {
  title: 'An error occurred.',
  description: 'Unable to create a new Expo Judging Session.',
  status: 'error',
  duration: 3000,
  isClosable: true,
};

const postExpoJudgingSession: () => Promise<ExpoJudgingSession> = async () => {
  const res: ExpoJudgingSession = await axios.post('/api/expoJudgingSession');
  return res;
};

export const AddExpoJudgingSession: React.FC = () => {
  const toast = useToast();
  let expoJudgingSession: ExpoJudgingSession | undefined;

  const tryPostExpoJudgingSession = async () => {
    try {
      expoJudgingSession = await postExpoJudgingSession();
      toast(SUCCESS_POST_TOAST);
    } catch {
      toast(FAILED_POST_TOAST);
    }

    return expoJudgingSession;
  };

  return (
    <Button
      onClick={async () => {
        await tryPostExpoJudgingSession();
      }}
    >
      Create Expo Judging Session
    </Button>
  );
};
