import shuffle from 'shuffle-array';
import { Team } from '../entities/team';
import { Judge } from '../entities/judge';

/* eslint-disable no-continue */

export async function createTeamData(numTeams: number): Promise<Team[]> {
  const teams: Team[] = [];
  for (let i = 0; i < numTeams; i += 1) {
    const team = await new Team(`Team ${i}`, i, `Project for Team ${i}`, [String(i)]).save();
    teams.push(team);
  }
  return teams;
}

export async function createJudgeData(numJudges: number): Promise<Judge[]> {
  const judges: Judge[] = [];
  for (let i = 0; i < numJudges; i += 1) {
    judges.push(await new Judge().save());
  }
  return judges;
}

/**
 * Use provided list of judges to judge the provided list of teams
 * @param judges - the array of judges used for judging
 * @param orderedTeams - the array of teams used for judging sorted in the order of highest score to lowest
 * @param percentVisitation - the percent of maximum visitation, where `(numTeams - 1) * numJudges` represents
 * the maximum number of possible visits
 */
export async function visitTeamsAndJudge(judges: Judge[], teams: Team[], percentVisitation = 0.7): Promise<Team[]> {
  // Shuffle teams to mitigate issues with DB ordering impacting scoring
  const orderedTeams: Team[] = shuffle(Object.assign([], teams));
  let currJudgeIdx = 0;
  let allJudgesHaveContinued = false;

  for (let i = 0; i < percentVisitation * teams.length * judges.length; i += 1) {
    const judge = judges[currJudgeIdx];
    await judge.getNextTeam();
    if (!judge.currentTeam) {
      // Judge has run out of teams to pick from
      continue;
    }

    // If necessary, continue before moving on
    if (!allJudgesHaveContinued) {
      await judge.continue();
      await judge.getNextTeam();
      if (currJudgeIdx === judges.length - 1) {
        allJudgesHaveContinued = true;
      }
    }

    // Prepare index for next loop
    if (currJudgeIdx === judges.length - 1) {
      currJudgeIdx = 0;
    } else {
      currJudgeIdx += 1;
    }

    // Evaluate teams for voting
    const previousTeamId = judge.previousTeam;
    let previousTeamIdx = Number.POSITIVE_INFINITY;
    let currentTeamIdx = 0;

    // Use the original, ordered list of teams to identify to determine which team should win
    orderedTeams.forEach((t, index) => {
      if (t.id === previousTeamId) {
        previousTeamIdx = index;
      } else if (t.id === judge.currentTeam) {
        currentTeamIdx = index;
      }
    });

    // TODO: Implement judge volatility
    const currTeamChosen = currentTeamIdx < previousTeamIdx;
    // console.log(`Judge ${judge.id} chose ${currTeamChosen ? currentTeamIdx : previousTeamIdx} over ${currTeamChosen ? previousTeamIdx : currentTeamIdx}`);
    await judge.vote(currTeamChosen);
  }
  return orderedTeams;
}
