import { ExpoJudgingSession, SerializedExpoJudgingSession } from '@hangar/shared';
import axios, { AxiosResponse, isAxiosError } from 'axios';
import dayjs from 'dayjs';

type FetchExpoJudgingSessionArgs = {
  expoJudgingSessionId: string;
};
type FetchExpoJudgingSessionError = Pick<AxiosResponse, 'status'>;

export const fetchExpoJudgingSession = async ({
  expoJudgingSessionId,
}: FetchExpoJudgingSessionArgs): Promise<ExpoJudgingSession | FetchExpoJudgingSessionError> => {
  try {
    const res = await axios.get<SerializedExpoJudgingSession>(
      `/api/expoJudgingSession/${expoJudgingSessionId}`,
    );
    const { data } = res;
    return { ...data, updatedAt: dayjs(data.updatedAt), createdAt: dayjs(data.createdAt) };
  } catch (error) {
    const defaultError: FetchExpoJudgingSessionError = { status: 500 };
    if (isAxiosError(error)) {
      return error.response ?? defaultError;
    }
    return defaultError;
  }
};
