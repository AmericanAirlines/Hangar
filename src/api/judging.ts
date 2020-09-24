import express from 'express';
import logger from '../logger';
import { JudgingVote, insufficientVoteCountError, TeamResult } from '../entities/judgingVote';
import { SupportRequest, SupportRequestStatus, SupportRequestType } from '../entities/supportRequest';
import { Team } from '../entities/team';

export const judging = express.Router();

export interface ExpandedTeamResult extends TeamResult {
  numberOfIdeaPitches: number;
  numberOfTechSupportSessions: number;
  bonusPointsAwarded: number;
  finalScore: number;
}

export const bonusPointsForIdeaPitch = 10;

judging.get('/results', async (_req, res) => {
  try {
    const expandedResults: ExpandedTeamResult[] = [];
    const results = await JudgingVote.tabulate();
    const requests = await SupportRequest.find({ status: SupportRequestStatus.Complete });
    const teams = await Team.find();

    results.forEach((teamResult) => {
      const matchingTeam = teams.find((team) => team.id === teamResult.id);

      let numberOfIdeaPitches = 0;
      let numberOfTechSupportSessions = 0;

      if (matchingTeam) {
        requests.forEach(({ type, slackId }) => {
          if (matchingTeam.members.includes(slackId)) {
            if (type === SupportRequestType.IdeaPitch) {
              numberOfIdeaPitches += 1;
            } else if (type === SupportRequestType.TechnicalSupport) {
              numberOfTechSupportSessions += 1;
            }
          }
        });
      }

      const bonusPointsAwarded = numberOfIdeaPitches > 0 ? bonusPointsForIdeaPitch : 0;

      expandedResults.push({
        numberOfIdeaPitches,
        numberOfTechSupportSessions,
        finalScore: teamResult.score + bonusPointsAwarded,
        bonusPointsAwarded,
        ...teamResult,
      });
    });

    res.send(expandedResults.sort((a, b) => b.finalScore - a.finalScore));
  } catch (err) {
    /* istanbul ignore next */
    if (err.name === insufficientVoteCountError) {
      res.status(200).send([]);
      return;
    }

    /* istanbul ignore next */
    res.status(500).send('Unable to retrieve judging results');
    /* istanbul ignore next */
    logger.error(err);
  }
});
