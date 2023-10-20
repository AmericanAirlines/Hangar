import axios, { AxiosResponse, isAxiosError } from 'axios';

type FetchExpoJudgingSessionArgs = {
  expoJudgingSessionId: string;
};
type FetchExpoJudgingSessionError = Pick<AxiosResponse, 'status'>;

export type ExpoJudgingSessionResult = {
  id: string;
  score: number;
  name: string;
};

export const fetchExpoJudgingSessionResults = async ({
  expoJudgingSessionId,
}: FetchExpoJudgingSessionArgs): Promise<
  ExpoJudgingSessionResult[] | FetchExpoJudgingSessionError
> => {
  try {
    const res = await axios.get<ExpoJudgingSessionResult[]>(
      `/api/expoJudgingSession/${expoJudgingSessionId}/results`,
    );
    return res.data;
  } catch (error) {
    const defaultError: FetchExpoJudgingSessionError = { status: 500 };
    if (isAxiosError(error)) {
      return error.response ?? defaultError;
    }
    return defaultError;
  }
};
