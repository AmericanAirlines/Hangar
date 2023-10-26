import { CriteriaJudgingSessionResults } from '@hangar/shared';
import axios from 'axios';
import { useCustomToast } from '../../../../components/utils/CustomToast';

type FetchExpoJudgingSessionArgs = {
  criteriaJudgingSessionId: string;
};

export const fetchCriteriaJudgingSessionResults = async ({
  criteriaJudgingSessionId,
}: FetchExpoJudgingSessionArgs): Promise<CriteriaJudgingSessionResults> => {
  try {
    const res = await axios.get<CriteriaJudgingSessionResults>(
      `/api/criteriaJudgingSession/${criteriaJudgingSessionId}/results`,
    );
    return res.data;
  } catch (error) {
    useCustomToast.getState().openErrorToast({ title: 'Failed to fetch results' });
    // eslint-disable-next-line no-console
    console.error(error);
    return {};
  }
};
