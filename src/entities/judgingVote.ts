import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { Team } from './team';

export const insufficientVoteCountError = 'InsufficientVoteCount';

export interface TeamScore {
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

  static converged = false;

  static async tabulate(): Promise<TeamResult[]> {
    const [teamResult, teamVists] = await this.updateScoresAndVisits();
    return teamResult;
  }

  static async updateScoresAndVisits(): Promise<[TeamResult[], Map<number, number>]> {
    const allVotes = await JudgingVote.find();
    const teams = await Team.find();
    const numTeams = teams.length;

    // maps team id to team score
    const scores = new Map() as Map<number, number>;
    const teamVisits = new Map() as Map<number, number>;

    //intialize scores
    teams.forEach((team) => {
      scores.set(team.id, 0);
      teamVisits.set(team.id, 0);
    });

    var count = 0;
    this.converged = false;
    allVotes.forEach((vote) => {
      count++;
      this.converged = this.updateScores(scores, teamVisits, vote.currentTeam, vote.previousTeam, vote.currentTeamChosen);
    });

    const teamResults: TeamResult[] = [];

    for (var i = 0; i < numTeams; i++) {
      const team_id = teams[i].id;
      teamResults.push({ id: team_id, name: teams[i].name, score: scores.get(team_id) });
    }

    return [teamResults, teamVisits];
  }

  static updateScores(Q: Map<number, number>, N: Map<number, number>, curr: number, prev: number, currentTeamChosen: boolean) {
    // visit teams curr and prev
    let reward;
    const converge_threshold = 0.01;

    N.set(curr, N.get(curr) + 1);
    N.set(prev, N.get(prev) + 1);

    if (currentTeamChosen) {
      reward = 1;
    } else {
      reward = 0;
    }

    var curr_Q = Q.get(curr);
    var prev_Q = Q.get(prev);

    // if (N.get(curr) == 1) curr_Q = 0;
    // if (N.get(prev) == 1) prev_Q = 0;

    // console.log(`setting ${curr} to ${curr_Q + (1 / N.get(curr)) * (reward - curr_Q)}`);
    // console.log(`${prev_Q} ${1.0 / N.get(prev)} ${reward == 1 ? 0 : 1 - prev_Q}`);
    Q.set(curr, curr_Q + (1.0 / N.get(curr)) * (reward - curr_Q));
    Q.set(prev, prev_Q + (1.0 / N.get(prev)) * ((reward == 1 ? 0 : 1) - prev_Q));

    const minVisit = [...N.values()].sort((a, b) => a - b)[0];
    const topNTeams = [...N.values()].sort((a, b) => a - b)[N.size - 3];
    // console.log('Q values');
    // console.log(Q);

    // console.log('Q');
    // console.log(Q);
    // console.log('N');
    // console.log(N);
    if (Math.abs(Q.get(curr) - curr_Q) < converge_threshold && Math.abs(Q.get(prev) - prev_Q) < converge_threshold && minVisit > 0 && topNTeams > 3) {
      return true;
    }
    return false;
  }
}
