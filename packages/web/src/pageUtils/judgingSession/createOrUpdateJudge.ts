import { Schema } from '@hangar/shared';
import axios, { isAxiosError } from 'axios';
import { z } from 'zod';

type CreateOrUpdateJudgeArgs = {
  inviteCode: string;
};

export const createOrUpdateJudge = async ({ inviteCode }: CreateOrUpdateJudgeArgs) => {
  const query: z.infer<typeof Schema.judge.post> = { inviteCode };
  const queryString = new URLSearchParams(query).toString();
  const judgeEndpoint = `/api/judge?${queryString}`;

  try {
    await axios.post(judgeEndpoint);
  } catch (postError) {
    if (!isAxiosError(postError) || postError.response?.status !== 409) {
      throw postError;
    }

    // Judge already exists; update the current judge
    await axios.put(judgeEndpoint);
  }
};
