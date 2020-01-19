import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import shuffle from 'shuffle-array';
import { Team } from './team';

export const insufficientVoteCountError = 'InsufficientVoteCount';

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
    const initialScores: { [id: string]: TeamScore }[] = [];

    // Use a designated percent of the votes for calibration
    const avgNumVotesPerTeam = allVotes.length / numTeams;
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
    const normalizedPosition: { [id: number]: number } = {};
    Object.values(initialScores).forEach((scores) => {
      // Convert object of team scores into a sortable array
      // Sort by pushing highest scored teams to the front of the array
      const teamScores = Object.values(scores).sort((a, b) => (a.score > b.score ? -1 : 1));

      // Record each team's position
      // This is necessary to avoid normalization
      // (i.e., the max/min scores from each pass aren't the same, so we can't avg those)
      teamScores.forEach((teamScore, position) => {
        normalizedPosition[teamScore.id] = (normalizedPosition[teamScore.id] || 0) + position;
      });
    });

    // Calculate averge position based on outcome of each randomized pass
    const avgPositions: number[] = Object.keys(normalizedPosition)
      .map((key) => Number(key))
      .sort((a, b) => (normalizedPosition[a] > normalizedPosition[b] ? 1 : -1));

    const orderedTeams = teams.sort((a: Team, b: Team) => (avgPositions.indexOf(a.id) < avgPositions.indexOf(b.id) ? -1 : 1));

    const teamResults: TeamResult[] = [];

    orderedTeams.forEach((teamScore, position) => {
      const matchingTeam = teams.find((team) => team.id === teamScore.id);
      teamResults.push({
        id: matchingTeam.id,
        name: matchingTeam.name,
        score: position,
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

        // Update min and max score
        minScore = Math.min(minScore, currentTeamScore.score, previousTeamScore.score);
        maxScore = Math.max(maxScore, currentTeamScore.score, previousTeamScore.score);

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

        // Update scores for both teams
        scores[currentTeamId] = currentTeamScore;
        scores[previousTeamId] = previousTeamScore;
      }
    }
    return scores;
  }
}
