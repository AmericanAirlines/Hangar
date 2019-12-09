import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import shuffle from 'shuffle-array';
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
    const initialScores: { [id: string]: TeamScore }[] = [];

    // Use a designated percent of the votes for calibration
    const avgNumVotesPerTeam = allVotes.length / numTeams;
    const percentOfVotesToUseForCalibration = 0.2;
    const percentBasedCalibrationVotes = Math.round(percentOfVotesToUseForCalibration * avgNumVotesPerTeam);
    // Use percentOfVotesToUseForCalibration percent of the votes OR 2, whichever is bigger
    const votesNeededForCalibration = Math.max(percentBasedCalibrationVotes, 2);

    // If the number of calibration votes is >= 50% of the votes for the team; throw error
    if (votesNeededForCalibration / avgNumVotesPerTeam >= 0.75) {
      throw new Error('Insufficient vote count for judging');
    }

    // Pass over the data in random order to obtain an unbiased baseline
    const randomJudgingIterations = 10;
    for (let j = 0; j < randomJudgingIterations; j += 1) {
      // Copy votes and randomize order to prevent bias based on vote ordering
      const votes = shuffle(Object.assign([], allVotes));
      // Score votes and add to array of scores
      initialScores.push(this.scoreVotes(votesNeededForCalibration, votes));
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

    // Sort based on match up difficulty by using averaged scores
    const votes = Object.assign([], allVotes).sort((a: JudgingVote, b: JudgingVote) => {
      const aScoreDifferential = avgPositions.indexOf(a.previousTeam) + avgPositions.indexOf(a.currentTeam);
      const bScoreDifferential = avgPositions.indexOf(b.previousTeam) + avgPositions.indexOf(b.currentTeam);
      // Sort from largest difference to smallest; save the more difficult matches until the end of scoring
      return aScoreDifferential > bScoreDifferential ? -1 : 1;
    });

    const finalScores = this.scoreVotes(votesNeededForCalibration, votes);

    const teamResults: TeamResult[] = [];
    Object.values(finalScores).forEach((teamScore) => {
      const matchingTeam = teams.find((team) => team.id === teamScore.id);
      teamResults.push({
        id: matchingTeam.id,
        name: matchingTeam.name,
        score: teamScore.score,
      });
    });

    return teamResults.sort((a, b) => (a.score > b.score ? -1 : 1));

    // TODO: Max final pass
    // TODO: Pass new value for calibration votes needed and/or calibration score
  }

  static scoreVotes(votesNeededForCalibration: number, votes: JudgingVote[]): { [id: string]: TeamScore } {
    const calibrationCount: { [id: string]: number } = {};
    // Reference corresponding scores dictionary
    const scores: { [id: string]: TeamScore } = {};

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
        const currentTeamScoreImpact = vote.currentTeamChosen ? 100 : -100;
        currentTeamScore.score += currentTeamScoreImpact;
        previousTeamScore.score += -currentTeamScoreImpact;
      } else {
        // ELO SCORING - both teams have been calibrated and have an ELO score
        // In order to determine differential between scores, "shift" minScore to 0
        const normalizationShift = minScore <= 0 ? Math.abs(minScore) : -minScore;
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
    return scores;
  }
}
