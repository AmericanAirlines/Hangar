import {
  ExpoJudgingSession,
  CriteriaJudgingSession,
  SerializedJudgingSession,
} from '@hangar/shared';
import axios, { AxiosResponse, isAxiosError } from 'axios';
import dayjs from 'dayjs';

export type FetchJudgingSessionArgs = {
  judgingSessionId: string;
  sessionType: 'expo' | 'criteria';
};
type FetchJudgingSessionError = Pick<AxiosResponse, 'status'>;

/**
 * Fetches and de-serializes a judging session with a given type
 */
export async function fetchJudgingSession(
  args: FetchJudgingSessionArgs & { sessionType: 'expo' },
): Promise<ExpoJudgingSession | FetchJudgingSessionError>;
export async function fetchJudgingSession(
  args: FetchJudgingSessionArgs & { sessionType: 'criteria' },
): Promise<CriteriaJudgingSession | FetchJudgingSessionError>;
export async function fetchJudgingSession(
  args: FetchJudgingSessionArgs,
): Promise<CriteriaJudgingSession | ExpoJudgingSession | FetchJudgingSessionError>;
export async function fetchJudgingSession({
  judgingSessionId,
  sessionType,
}: FetchJudgingSessionArgs) {
  try {
    const res = await axios.get<SerializedJudgingSession>(
      `/api/${sessionType}JudgingSession/${judgingSessionId}`,
    );
    const { data: serializedData } = res;
    const data = {
      ...serializedData,
      updatedAt: dayjs(serializedData.updatedAt),
      createdAt: dayjs(serializedData.createdAt),
    };
    return data;
  } catch (error) {
    const defaultError: FetchJudgingSessionError = { status: 500 };
    if (isAxiosError(error)) {
      return error.response ?? defaultError;
    }
    return defaultError;
  }
}
