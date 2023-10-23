import { CriteriaJudgingSession, SerializedCriteriaJudgingSession } from '@hangar/shared';
import axios from 'axios';
import dayjs from 'dayjs';
import { openErrorToast } from '../../components/utils/CustomToast';

export const fetchCriteriaJudgingSessions = async () => {
  try {
    const res = await axios.get<SerializedCriteriaJudgingSession[]>(`/api/criteriaJudgingSession`);
    return res.data.map(
      ({ createdAt, updatedAt, ...rest }) =>
        ({
          ...rest,
          createdAt: dayjs(createdAt),
          updatedAt: dayjs(updatedAt),
        } as CriteriaJudgingSession),
    );
  } catch (error) {
    if (!axios.isAxiosError(error) || error.status !== 401) {
      // eslint-disable-next-line no-console
      console.error(error);
      openErrorToast({
        title: 'Failed to fetch Criteria Judging Sessions',
        description: (error as Error).message,
      });
    }
  }

  return [];
};
