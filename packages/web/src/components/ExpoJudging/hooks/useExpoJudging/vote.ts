import axios from 'axios';

type VoteArgs = {
  expoJudgingSessionId: string;
  currentProjectChosen: boolean;
};

export const vote = async ({ expoJudgingSessionId, currentProjectChosen }: VoteArgs) => {
  await axios.post(`/api/expoJudgingVote`, { expoJudgingSessionId, currentProjectChosen });
};
