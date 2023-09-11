import { ExpoJudgingSession, SerializedExpoJudgingSession, Schema } from '@hangar/shared';
import z from 'zod';
import axios from 'axios';
import dayjs from 'dayjs';

type CreateExpoJudgingSessionArgs = z.infer<typeof Schema.expoJudgingSession.post>;

export const createExpoJudgingSession = async (args: CreateExpoJudgingSessionArgs) => {
  try {
    const res = await axios.post<SerializedExpoJudgingSession>(`/api/expoJudgingSession`);

    return res.data.map(
      ({ createdAt, updatedAt, ...rest }) =>
        ({
          ...rest,
          createdAt: dayjs(createdAt),
          updatedAt: dayjs(updatedAt),
        } as ExpoJudgingSession),
    );
  } catch (error) {
    if (!axios.isAxiosError(error) || error.status !== 401) {
      // eslint-disable-next-line no-console
      console.error(error);
      // TODO: Show error toast
    }
  }

  return [];
};
