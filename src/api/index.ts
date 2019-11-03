import 'dotenv/config';
import express from 'express';
import { Judge } from '../entities/judge';
import { Team } from '../entities/team';

const api = express();

api.get('/', (_req, res) => {
  res.send('🌊');
});

api.post('/judge', async (_req, res) => {
  const judge = await new Judge().save();

  res.send(judge.id.toString());
});

const getJudgeTeams = async (judge: Judge): Promise<{ currentTeam: Team; previousTeam: Team }> => {
  const previousTeamId = judge.visitedTeams.pop();

  let currentTeam;
  if (judge.currentTeam) {
    currentTeam = await Team.findOne(judge.currentTeam);
  } else {
    currentTeam = ((await judge.getNextTeam()) as unknown) as Team;
  }

  const previousTeam = await Team.findOne(previousTeamId);

  return {
    currentTeam,
    previousTeam,
  };
};

api.get('/judge/teams', async (req, res) => {
  const judge = await Judge.findOneOrFail(parseInt(req.query.id, 10));

  res.send(await getJudgeTeams(judge));
});

api.post('/vote', async (req, res) => {
  const judge = await Judge.findOneOrFail(req.body.id);

  if (req.body.currentTeamChosen === null) {
    await judge.continue();
  } else {
    await judge.vote(req.body.currentTeamChosen);
  }

  res.send(await getJudgeTeams(judge));
});

export const apiApp = api;
