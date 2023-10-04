import React from 'react';
import axios from 'axios';
import { Button } from '@chakra-ui/react';
import { ExpoJudgingSession } from '@hangar/shared';
import { openErrorToast, openSuccessToast } from '../utils/CustomToast';

const postExpoJudgingSession: () => Promise<ExpoJudgingSession> = async () => {
  const res: ExpoJudgingSession = await axios.post('/api/expoJudgingSession');
  return res;
};

export const AddExpoJudgingSession: React.FC = () => {
  let expoJudgingSession: ExpoJudgingSession | undefined;

  const tryPostExpoJudgingSession = async () => {
    try {
      expoJudgingSession = await postExpoJudgingSession();
      openSuccessToast({
        title: 'Success!',
        description: 'Expo Judging Session successfully created.',
      });
    } catch {
      openErrorToast({
        title: 'An error occurred.',
        description: 'Unable to create a new Expo Judging Session.',
      });
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
