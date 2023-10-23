import { SerializedCriteriaJudgingSession, Schema, CriteriaJudgingSession } from '@hangar/shared';
import z from 'zod';
import axios from 'axios';
import dayjs from 'dayjs';
import { openErrorToast } from '../../components/utils/CustomToast';

type CreateCriteriaJudgingSessionArgs = z.infer<typeof Schema.criteriaJudgingSession.post>;

export const createCriteriaJudgingSession = async (args: CreateCriteriaJudgingSessionArgs) => {
  try {
    const { data } = await axios.post<SerializedCriteriaJudgingSession>(
      `/api/criteriaJudgingSession`,
      args,
    );
    const { createdAt, updatedAt, ...rest } = data;
    return {
      ...rest,
      createdAt: dayjs(createdAt),
      updatedAt: dayjs(updatedAt),
    } as CriteriaJudgingSession;
  } catch (error) {
    if (!axios.isAxiosError(error) || error.status !== 401) {
      // eslint-disable-next-line no-console
      console.error(error);
      openErrorToast({
        title: 'Failed to create Criteria Judging Session',
        description: (error as Error).message,
      });
    }
  }

  return undefined;
};
