import express from 'express';
import { Judge } from '../entities/judge';
import { Team } from '../entities/team';

interface JudgeTeams {
  currentTeam: Team;
  previousTeam: Team;
}

export const judgeActions = express.Router();

const getJudgeTeams = async (judge: Judge): Promise<JudgeTeams> => {
  const previousTeamId = judge.previousTeam;

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

judgeActions.get('/judge/teams', async (req, res) => {
  const judge = await Judge.findOneOrFail(parseInt(req.query.id, 10));

  res.send(await getJudgeTeams(judge));
});

judgeActions.post('/vote', async (req, res) => {
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

judgeActions.post('/skip', async (req, res) => {
  if (!req.body.id) {
    res.sendStatus(400).send('No id');
    return;
  }

  const judge = await Judge.findOne(req.body.id);

  await judge.skip();

  res.send(await getJudgeTeams(judge));
});

judgeActions.post('/break', async (req, res) => {
  if (!req.body.id) {
    res.sendStatus(400).send('No id');
    return;
  }

  const judge = await Judge.findOne(req.body.id);

  if (judge) {
    await judge.stepAway();
  }

  res.send({ success: judge?.away ?? false });
});

judgeActions.post('/resume', async (req, res) => {
  if (!req.body.id) {
    res.sendStatus(400).send('No id');
    return;
  }

  const judge = await Judge.findOne(req.body.id);
  let judgeTeams: JudgeTeams;

  if (judge) {
    await judge.resumeJudging();
    judgeTeams = await getJudgeTeams(judge);
  }

  res.send(judgeTeams);
});
