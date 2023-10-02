import { ExpoJudgingSession, SerializedExpoJudgingSession } from '@hangar/shared';
import axios, { isAxiosError } from 'axios';
import dayjs from 'dayjs';
import { openErrorToast } from '../components/utils/CustomToast';

type FetchExpoJudgingSessionArgs = {
  showError: boolean;
  expoJudgingSessionId: string;
};

export const fetchJudgingSession = async ({
  showError,
  expoJudgingSessionId,
}: FetchExpoJudgingSessionArgs): Promise<ExpoJudgingSession | undefined> => {
  try {
    const res = await axios.get<SerializedExpoJudgingSession>(
      `/api/expoJudgingSession/${expoJudgingSessionId}`,
    );
    const { data } = res;
    return { ...data, updatedAt: dayjs(data.updatedAt), createdAt: dayjs(data.createdAt) };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status !== 401 && showError) {
      openErrorToast({
        title: 'Failed to fetch Expo Judging Session details',
        description: error.message,
      });
    }
    return undefined;
  }
};
