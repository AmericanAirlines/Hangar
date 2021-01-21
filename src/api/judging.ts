import express from 'express';
import logger from '../logger';
import { JudgingVote, insufficientVoteCountError, TeamResult } from '../entities/judgingVote';
import { SupportRequest } from '../entities/supportRequest';
import { SupportRequestStatus, SupportRequestType } from '../types/supportRequest';
import { Team } from '../entities/team';

export const judging = express.Router();

export interface ExpandedTeamResult extends TeamResult {
  numberOfIdeaPitches: number;
  numberOfTechSupportSessions: number;
  bonusPointsAwarded: number;
  finalScore: number;
}

export const bonusPointsForIdeaPitch = 10;

judging.get('/results', async (req, res) => {
  try {
    const expandedResults: ExpandedTeamResult[] = [];
    const results = await JudgingVote.tabulate();
    const requests = await SupportRequest.find({ status: SupportRequestStatus.Complete });
    const teams = await Team.find();

    Object.values(results).forEach((teamResult) => {
      const matchingTeam = teams.find((team) => team.id === teamResult.id);
      const ideaPitches = requests.filter(
        (request) => request.type === SupportRequestType.IdeaPitch && matchingTeam.members.includes(request.slackId),
      );
      const techtHelpSessions = requests.filter(
        (request) => request.type === SupportRequestType.TechnicalSupport && matchingTeam.members.includes(request.slackId),
      );
      const bonusPointsAwarded = ideaPitches.length > 0 ? bonusPointsForIdeaPitch : 0;

      expandedResults.push({
        numberOfIdeaPitches: ideaPitches.length,
        numberOfTechSupportSessions: techtHelpSessions.length,
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
