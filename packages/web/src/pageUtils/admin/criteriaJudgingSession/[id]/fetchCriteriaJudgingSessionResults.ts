import { CriteriaJudgingSessionResults } from '@hangar/shared';
import axios from 'axios';

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
    // TODO: Handle error
    return {};
  }
};
