import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { Team } from './team';

interface TeamScore {
  id: number;
  score: number;
}

interface TeamResult extends TeamScore {
  name: string;
}

@Entity()
export class JudgingVote extends BaseEntity {
  constructor(previousTeam: number, currentTeam: number, currentTeamChosen: boolean) {
    super();

    this.previousTeam = previousTeam;
    this.currentTeam = currentTeam;
    this.currentTeamChosen = currentTeamChosen;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  previousTeam: number;

  @Column()
  currentTeam: number;

  @Column()
  currentTeamChosen: boolean;

  static async tabulate(): Promise<TeamResult[]> {
    const allVotes = await JudgingVote.find();
    const teams = await Team.find();
    const numTeams = teams.length;

    // Initialize score keeping
    const ascScores: { [id: string]: TeamScore } = {};
    const descScores: { [id: string]: TeamScore } = {};

    // Use a designated percent of the votes for calibration
    const avgNumVotesPerTeam = allVotes.length / numTeams;
    const percentOfVotesToUseForCalibration = 0.2;
    const percentBasedCalibrationVotes = Math.round(percentOfVotesToUseForCalibration * avgNumVotesPerTeam);
    // Use percentOfVotesToUseForCalibration percent of the votes OR 2, whichever is bigger
    const votesNeededForCalibration = Math.max(percentBasedCalibrationVotes, 2);

    // If the number of calibration votes is >= 50% of the votes for the team; throw error
    if (votesNeededForCalibration / avgNumVotesPerTeam >= 0.5) {
      throw new Error('Insufficient vote count for judging');
    }

    for (let j = 0; j < 2; j += 1) {
      const calibrationCount: { [id: string]: number } = {};
      // First pass is ascending, second pass is descending
      const asc = j === 0;
      // Reference corresponding scores dictionary
      const scores = asc ? ascScores : descScores;
      // Copy votes for iteration
      const votes = Object.assign([], allVotes);

      // Reverse to achieve descending order
      if (!asc) {
        votes.reverse();
      }

      let minScore = Number.POSITIVE_INFINITY;
      let maxScore = Number.NEGATIVE_INFINITY;

      for (let i = 0; i < votes.length; i += 1) {
        const vote = votes[i];

        const currentTeamId = vote.currentTeam;
        const previousTeamId = vote.previousTeam;

        const currentTeamScore = scores[currentTeamId] || { id: currentTeamId, score: 0 };
        const previousTeamScore = scores[previousTeamId] || { id: previousTeamId, score: 0 };

        // Update min and max score
        minScore = Math.min(minScore, currentTeamScore.score, previousTeamScore.score);
        maxScore = Math.max(maxScore, currentTeamScore.score, previousTeamScore.score);

        if ((calibrationCount[currentTeamId] || 0) + (calibrationCount[previousTeamId] || 0) < votesNeededForCalibration * 2) {
          // SIMPLE SCORING - one or both of the teams is uncalibrated
          // Increment calibration count for each team
          calibrationCount[currentTeamId] = calibrationCount[currentTeamId] ? calibrationCount[currentTeamId] + 1 : 1;
          calibrationCount[previousTeamId] = calibrationCount[previousTeamId] ? calibrationCount[previousTeamId] + 1 : 1;

          // Apply score impact based on vote outcome
          const currentTeamScoreImpact = vote.currentTeamChosen ? 25 : -25;
          currentTeamScore.score += currentTeamScoreImpact;
          previousTeamScore.score += -currentTeamScoreImpact;
        } else {
          // ELO SCORING - both teams have been calibrated and have an ELO score
          // In order to determine differential between scores, "shift" minScore to 0, If...
          //   Positive min: shift is negative
          //   Negative min: shift is positive (double negative)
          //   Zero min: shift is zero (-1 * 0 = 0)
          const normalizationShift = -minScore;
          const normalizedMaxScore = maxScore + normalizationShift;

          // Calculate team percentiles using the normalizationShift and normalizedMaxScore
          const currentTeamPercentile = (currentTeamScore.score + normalizationShift) / normalizedMaxScore;
          const previousTeamPercentile = (previousTeamScore.score + normalizationShift) / normalizedMaxScore;

          // Determine whether the scoreImpact should be positive or negative
          // Current Team Advantage: potential positive decreases, potential negative increases
          const advantageCoeficient = currentTeamPercentile > previousTeamPercentile ? -1 : 1;
          const currentTeamScoreImpact = advantageCoeficient * Math.round(100 * Math.abs(currentTeamPercentile - previousTeamPercentile));
          const previousTeamScoreImpact = -advantageCoeficient * Math.round(100 * Math.abs(currentTeamPercentile - previousTeamPercentile));

          // Apply score impact based on vote outcome
          currentTeamScore.score += (vote.currentTeamChosen ? 100 : -100) + currentTeamScoreImpact;
          previousTeamScore.score += (vote.currentTeamChosen ? -100 : 100) + previousTeamScoreImpact;
        }

        // Update scores for both teams
        scores[currentTeamId] = currentTeamScore;
        scores[previousTeamId] = previousTeamScore;
      }
    }

    // Average scores from both passes
    const teamResults: TeamResult[] = [];
    Object.values(ascScores).forEach((teamScore) => {
      const matchingTeam = teams.find((team) => team.id === teamScore.id);
      teamResults.push({
        id: matchingTeam.id,
        name: matchingTeam.name,
        score: Math.round((teamScore.score + descScores[teamScore.id].score) / 2),
      });
    });

    // Sort and return final scores
    return teamResults.sort((a, b) => (a.score > b.score ? -1 : 1));
  }
}
