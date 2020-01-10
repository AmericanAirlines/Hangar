import 'dotenv/config';
import express from 'express';
import { Judge } from '../entities/judge';
import { Team } from '../entities/team';
import sendUpdateMessage from './sendUpdateMessage';

const api = express();

api.use(express.json());

api.get('/', (_req, res) => {
  res.send('🌊');
});

api.post('/judge', async (_req, res) => {
  const judge = await new Judge().save();

  res.send(judge.id.toString());
});

const getJudgeTeams = async (judge: Judge): Promise<{ currentTeam: Team; previousTeam: Team }> => {
  const previousTeamId = judge.visitedTeams[judge.visitedTeams.length - 1];

  let currentTeam;
  if (judge.currentTeam) {
    currentTeam = await Team.findOne(judge.currentTeam);
  } else {
    currentTeam = ((await judge.getNextTeam()) as unknown) as Team;
  }

  let previousTeam;
  if (previousTeamId) {
    previousTeam = await Team.findOne(previousTeamId);
  }

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
  if (!req.body.id) {
    res.sendStatus(500).send('Whoops');
    return;
  }

  const judge = await Judge.findOne(req.body.id);

  if (req.body.currentTeamChosen === null || req.body.currentTeamChosen === undefined) {
    await judge.continue();
  } else {
    await judge.vote(req.body.currentTeamChosen);
  }

  res.send(await getJudgeTeams(judge));
});

api.post('/skip', async (req, res) => {
  if (!req.body.id) {
    res.sendStatus(500).send('No id');
    return;
  }

  const judge = await Judge.findOne(req.body.id);

  await judge.skip();

  res.send(await getJudgeTeams(judge));
});

api.post('/sendUpdateMessage', sendUpdateMessage);

export const apiApp = api;
