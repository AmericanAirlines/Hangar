import { ExpoJudgingSession, SerializedExpoJudgingSession } from '@hangar/shared';
import axios from 'axios';
import dayjs from 'dayjs';

export const fetchExpoJudgingSessions = async () => {
  try {
    const res = await axios.get<SerializedExpoJudgingSession[]>(`/api/expoJudgingSession`);
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
