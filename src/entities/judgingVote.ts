import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import shuffle from 'shuffle-array';
import { Team } from './team';

export const insufficientVoteCountError = 'InsufficientVoteCount';

interface TeamScore {
  id: number;
  score: number;
}

export interface TeamResult extends TeamScore {
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
    const initialScores: { [id: string]: TeamScore }[] = [];

    // Use a designated percent of the votes for calibration
    const avgNumVotesPerTeam = numTeams ? allVotes.length / numTeams : 0;
    const percentOfVotesToUseForCalibration = 0.2;
    const percentBasedCalibrationVotes = Math.round(percentOfVotesToUseForCalibration * avgNumVotesPerTeam);
    // Use percentOfVotesToUseForCalibration percent of the votes OR 2, whichever is bigger
    const votesNeededForCalibration = Math.max(percentBasedCalibrationVotes, 2);

    // If the number of calibration votes is >= 50% of the votes for the team; throw error
    if (avgNumVotesPerTeam === 0 || votesNeededForCalibration / avgNumVotesPerTeam >= 0.75) {
      const error = new Error('Insufficient vote count for judging');
      error.name = insufficientVoteCountError;
      throw error;
    }

    // Pass over the data in random order to obtain an unbiased baseline
    const randomJudgingIterations = 20;
    for (let j = 0; j < randomJudgingIterations; j += 1) {
      // Randomize order to prevent bias based on vote ordering
      initialScores.push(this.scoreVotes(votesNeededForCalibration, shuffle([...allVotes]), shuffle([...teams])));
    }

    // Average scores from all passes
    const normalizedScores: { [id: string]: number[] } = {};
    Object.values(initialScores).forEach((scores) => {
      Object.values(scores).forEach((teamScore) => {
        normalizedScores[teamScore.id] = normalizedScores[teamScore.id] ? [...normalizedScores[teamScore.id], teamScore.score] : [teamScore.score];
      });
    });

    const trimmedMeanScores: { [id: string]: number } = {};
    const percentOfOutliersToRemove = 0.2;
    const outliersToRemoveFromEachSide = Math.max(Math.floor(percentOfOutliersToRemove * randomJudgingIterations) / 2, 1);
    for (let i = 0; i < Object.keys(normalizedScores).length; i += 1) {
      const teamId = Object.keys(normalizedScores)[i];
      const sortedScores = normalizedScores[teamId].sort();
      // Remove outlier(s) from front
      sortedScores.splice(0, outliersToRemoveFromEachSide);
      // Remove outlier(s) from end
      sortedScores.splice(sortedScores.length - outliersToRemoveFromEachSide, outliersToRemoveFromEachSide);

      let sum = 0;
      sortedScores.forEach((score) => {
        sum += score;
      });
      trimmedMeanScores[teamId] = sum / sortedScores.length;
    }

    const orderedTeams = teams.sort((a: Team, b: Team) => (trimmedMeanScores[a.id] > trimmedMeanScores[b.id] ? -1 : 1));

    const teamResults: TeamResult[] = [];

    orderedTeams.forEach((scoredTeam) => {
      const matchingTeam = teams.find((team) => team.id === scoredTeam.id);
      teamResults.push({
        id: matchingTeam.id,
        name: matchingTeam.name,
        score: trimmedMeanScores[scoredTeam.id],
      });
    });

    return teamResults;
  }

  static scoreVotes(
    votesNeededForCalibration: number,
    votes: JudgingVote[],
    teams: Team[],
    calibrationScoreImpact = 150,
  ): { [id: string]: TeamScore } {
    // Reference corresponding scores dictionary
    const scores: { [id: string]: TeamScore } = {};

    let minScore = Number.POSITIVE_INFINITY;
    let maxScore = Number.NEGATIVE_INFINITY;

    const calibrationCount: { [id: string]: number } = {};
    let calibrationComplete = false;
    const remainingVotes = [...votes];

    // Iterate over all votes
    for (let i = 0; i < votes.length; i += 1) {
      if (!calibrationComplete) {
        // Not all teams have been calibrated
        // Select the team with the lowest calibration count
        const team = teams.sort((teamA, teamB) => ((calibrationCount[teamA.id] || 0) <= (calibrationCount[teamB.id] || 0) ? -1 : 1))[0];

        // Retrieve all remaining votes where the selected team is evaluated
        const teamVotes = remainingVotes.filter((voteToCompare) => voteToCompare.currentTeam === team.id || voteToCompare.previousTeam === team.id);

        // Sort team votes by the team with the lowest calibration count
        const vote = teamVotes.sort((a, b) => {
          const otherTeamIdA = a.currentTeam !== team.id ? a.currentTeam : a.previousTeam;
          const otherTeamIdB = b.currentTeam !== team.id ? b.currentTeam : b.previousTeam;
          return (calibrationCount[otherTeamIdA] || 0) <= (calibrationCount[otherTeamIdB] || 0) ? -1 : 1;
        })[0];

        // Get team details for other team
        const otherTeamId = vote.currentTeam !== team.id ? vote.currentTeam : vote.previousTeam;
        const otherTeam = teams.find((teamToCompare) => teamToCompare.id === otherTeamId);

        // Remove that vote from the remaining votes
        remainingVotes.splice(votes.indexOf(vote), 1);

        // Increment calibration counts for both teams
        calibrationCount[team.id] = calibrationCount[team.id] ? calibrationCount[team.id] + 1 : 1;
        calibrationCount[otherTeam.id] = calibrationCount[otherTeam.id] ? calibrationCount[otherTeam.id] + 1 : 1;

        // CALIBRATION SCORING
        const teamScore = scores[team.id] || { id: team.id, score: 0 };
        const otherTeamScore = scores[otherTeam.id] || { id: otherTeam.id, score: 0 };

        // Apply score impact based on vote outcome
        const currentTeamScoreImpact = vote.currentTeamChosen ? calibrationScoreImpact : -calibrationScoreImpact;
        teamScore.score += currentTeamScoreImpact;
        otherTeamScore.score += -currentTeamScoreImpact;

        // Update scores for both teams
        scores[team.id] = teamScore;
        scores[otherTeam.id] = otherTeamScore;

        // Check to see if all teams have been calibrated
        const allTeamsAreInCalibration = Object.keys(calibrationCount).length === teams.length;
        const allTeamsAreCalibrated = !Object.values(calibrationCount).some((value) => value < votesNeededForCalibration);
        if (allTeamsAreInCalibration && allTeamsAreCalibrated) {
          calibrationComplete = true;
          // Update min/max score for traditional scoring
          const calibratedScores = Object.values(scores);
          for (let j = 0; j < calibratedScores.length; j += 1) {
            minScore = Math.min(minScore, calibratedScores[j].score);
            maxScore = Math.max(maxScore, calibratedScores[j].score);
          }
        }
      } else {
        const vote = remainingVotes.shift();

        const currentTeamId = vote.currentTeam;
        const previousTeamId = vote.previousTeam;

        const currentTeamScore = scores[currentTeamId];
        const previousTeamScore = scores[previousTeamId];

        // ELO SCORING - both teams have been calibrated and have an ELO score
        // In order to determine differential between scores, "shift" minScore to 0, If...
        //   Positive min: shift is negative
        //   Negative min: shift is positive (double negative)
        //   Zero min: shift is zero (-1 * 0 = 0)
        const normalizationShift = -minScore;
        const normalizedMaxScore = maxScore + normalizationShift;

        // Calculate team percentiles using the normalizationShift and normalizedMaxScore
        // If min and max are equal, normalized max will be 0; replace percentile with 0 to allow for max impact
        const currentTeamPercentile = (currentTeamScore.score + normalizationShift) / normalizedMaxScore || 0;
        const previousTeamPercentile = (previousTeamScore.score + normalizationShift) / normalizedMaxScore || 0;

        // Determine whether the scoreImpact should be positive or negative
        // Current Team Advantage: potential positive decreases, potential negative increases
        const advantageCoeficient = currentTeamPercentile > previousTeamPercentile ? -1 : 1;
        const currentTeamScoreImpact = advantageCoeficient * Math.round(100 * Math.abs(currentTeamPercentile - previousTeamPercentile));
        const previousTeamScoreImpact = -advantageCoeficient * Math.round(100 * Math.abs(currentTeamPercentile - previousTeamPercentile));

        // Apply score impact based on vote outcome
        currentTeamScore.score += (vote.currentTeamChosen ? 100 : -100) + currentTeamScoreImpact;
        previousTeamScore.score += (vote.currentTeamChosen ? -100 : 100) + previousTeamScoreImpact;

        // Update scores for both teams
        scores[currentTeamId] = currentTeamScore;
        scores[previousTeamId] = previousTeamScore;

        // Update min and max score
        const rawScores = Object.values(scores).map((score) => score.score);
        maxScore = Math.max(...rawScores);
        minScore = Math.min(...rawScores);
      }
    }

    // Normalized score from 0 to 100
    for (let i = 0; i < Object.keys(scores).length; i += 1) {
      const teamId = Object.keys(scores)[i];
      const { score } = scores[teamId];
      // Shift min score to zero, shift max score by an equal amount, get the normalized score
      //   as a percent of the max
      const normalizedScore = ((score - minScore) / (maxScore - minScore)) * 100;
      scores[teamId].score = normalizedScore;
    }

    return scores;
  }
}
