import { SerializedExpoJudgingSession, Schema, ExpoJudgingSession } from '@hangar/shared';
import z from 'zod';
import axios from 'axios';
import dayjs from 'dayjs';
import { useCustomToast } from '../../components/utils/CustomToast';

type CreateExpoJudgingSessionArgs = z.infer<typeof Schema.expoJudgingSession.post>;

export const createExpoJudgingSession = async (args: CreateExpoJudgingSessionArgs = {}) => {
  try {
    const { data } = await axios.post<SerializedExpoJudgingSession>(`/api/expoJudgingSession`, {
      args,
    });
    const { createdAt, updatedAt, ...rest } = data;
    return {
      ...rest,
      createdAt: dayjs(createdAt),
      updatedAt: dayjs(updatedAt),
    } as ExpoJudgingSession;
  } catch (error) {
    if (!axios.isAxiosError(error) || error.status !== 401) {
      // eslint-disable-next-line no-console
      console.error(error);
      // TODO: Show error toast
      useCustomToast.getState().openErrorToast({
        title: 'Failed to create Expo Judging Session details',
        description: (error as Error).message,
      });
    }
  }

  return {} as ExpoJudgingSession;
};
