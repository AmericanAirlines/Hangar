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

    // Initalize score keeping
    const initialScores: { [id: string]: TeamScore } = {};

    const scores: { [id: string]: number } = {};

    // Object.values(initialScores).forEach((scores) => {
    //   Object.values(scores).forEach((teamScore) => {
    //     scores[id] = initialScores[teamScore.id] ? [initialScores[teamScore.id], teamScore.score] : [teamScore.score];
    //   });
    // });

    // const sortedScores = initalScores[teamId].sort();

    // // Sort results by score, match scored team with team, return results
    // const orderedTeams = teams.sort((a: Team, b: Team) => (scores[a.id] > scores[b.id] ? -1 : 1));
    const teamResults: TeamResult[] = [];

    // orderedTeams.forEach((scoredTeam) => {
    //   const matchingTeam = teams.find((team) => team.id === scoredTeam.id);
    //   teamResults.push({
    //     id: matchingTeam.id,
    //     name: matchingTeam.name,
    //     score: orderedTeams[scoredTeam.id],
    //   });
    // });

    return teamResults;
  }

  /*
  upsateScores inputs:
    array of team scores (Q), array of team visits (N), current team (curr),
    previous team q index (prev), winner(winner)
  Returns: True if done converging, False otherwise
  */
  static async updateScores(Q: [number], N: [number], curr: number, prev: number, winner: number) {
    // visit teams curr and prev
    let reward;
    const converge_threshold = 0.001;

    N[curr] += 1;
    N[prev] += 1;

    if (winner == curr) {
      reward = 1;
    } else {
      reward = 0;
    }

    const curr_Q = Q[curr];
    const prev_Q = Q[prev];

    // incremental average
    Q[curr] = Q[curr] + (1 / N[curr]) * (reward - Q[curr]);
    if (reward == 0) {
      Q[prev] = Q[prev] + (1 / N[prev]) * (1 - Q[prev]);
    } else {
      Q[prev] = Q[prev] + (1 / N[prev]) * (0 - Q[prev]);
    }

    if (Math.abs(Q[curr] - curr_Q) < converge_threshold) {
      return true;
    }
    return false;
  }
}
