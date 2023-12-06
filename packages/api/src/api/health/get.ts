import { ExpoJudgingVote } from '@hangar/database';
import { Request, Response } from 'express';

export const get = async (req: Request, res: Response) => {
  const db = await req.entityManager.getConnection().isConnected();

  const dependencies: { [id: string]: boolean } = { db };
  const ok = Object.values(dependencies).every((val) => !!val);

  const votes = await req.entityManager.find(ExpoJudgingVote, {});
  const counts: Record<string, number> = {};
  for (let i = 0; i < votes.length; i += 1) {
    const vote = votes[i] as (typeof votes)[0];
    if (vote.currentProject) {
      counts[vote.currentProject.id] = (counts[vote.currentProject.id] ?? 0) + 1;
    }
    if (vote.previousProject) {
      counts[vote.previousProject.id] = (counts[vote.previousProject.id] ?? 0) + 1;
    }
  }
  const sortedCounts = Object.entries(counts).sort((a, b) => a[1] - b[1]);
  console.log(sortedCounts);

  res.status(ok ? 200 : 503).send({
    ok,
    ...Object.assign({}, ...Object.entries(dependencies).map(([key, val]) => ({ [key]: val }))),
  });
};
