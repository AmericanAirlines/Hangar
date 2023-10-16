import React from 'react';
import { Button } from '@chakra-ui/react';
import { ExpoJudgingSession } from '@hangar/shared';
import { openErrorToast, openSuccessToast } from '../utils/CustomToast';
import { useExpoJudgingSessionStore } from '../../stores/expoJudgingSession';

export const AddExpoJudgingSessionButton: React.FC = () => {
  const { addExpoJudgingSession } = useExpoJudgingSessionStore();
  let expoJudgingSession: ExpoJudgingSession | undefined;

  const tryPostExpoJudgingSession = async () => {
    try {
      await addExpoJudgingSession();
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
