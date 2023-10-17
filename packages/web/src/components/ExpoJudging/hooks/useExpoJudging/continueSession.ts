import axios from 'axios';

type ContinueSessionArgs = {
  expoJudgingSessionId: string;
};

export const continueSession = async ({ expoJudgingSessionId: id }: ContinueSessionArgs) => {
  await axios.post(`/api/expoJudgingSession/${id}/continueSession`);
};
