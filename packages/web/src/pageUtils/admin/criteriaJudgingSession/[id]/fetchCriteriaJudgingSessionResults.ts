import {
  CriteriaJudgingSessionResults,
  SerializedCriteriaJudgingSessionResults,
} from '@hangar/shared';
import dayjs from 'dayjs';
import axios from 'axios';
import { useCustomToast } from '../../../../components/utils/CustomToast';

type FetchExpoJudgingSessionArgs = {
  criteriaJudgingSessionId: string;
};

export const fetchCriteriaJudgingSessionResults = async ({
  criteriaJudgingSessionId,
}: FetchExpoJudgingSessionArgs): Promise<CriteriaJudgingSessionResults> => {
  try {
    const res = await axios.get<SerializedCriteriaJudgingSessionResults>(
      `/api/criteriaJudgingSession/${criteriaJudgingSessionId}/results`,
    );
    return res.data.map((p) => ({
      ...p,
      createdAt: dayjs(p.createdAt),
      updatedAt: dayjs(p.updatedAt),
    }));
  } catch (error) {
    useCustomToast.getState().openErrorToast({ title: 'Failed to fetch results' });
    // eslint-disable-next-line no-console
    console.error(error);
    return [];
  }
};
