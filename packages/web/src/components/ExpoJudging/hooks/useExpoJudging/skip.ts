import axios from 'axios';

type SkipArgs = {
  expoJudgingSessionId: string;
};

export const skip = async ({ expoJudgingSessionId: id }: SkipArgs) => {
  await axios.post(`/api/expoJudgingSession/${id}/skip`);
};
