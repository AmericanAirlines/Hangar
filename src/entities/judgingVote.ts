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
    const teamResult = await this.updateScoresAndVisits();
    return teamResult[0];
  }

  static async updateScoresAndVisits(): Promise<[TeamResult[], Map<number, number>]> {
    const allVotes = await JudgingVote.find();
    const teams = await Team.find();
    const numTeams = teams.length;

    // maps team id to team score
    const scores = new Map() as Map<number, number>;
    const teamVisits = new Map() as Map<number, number>;

    // intialize scores
    teams.forEach((team) => {
      scores.set(team.id, 0);
      teamVisits.set(team.id, 0);
    });

    this.converged = false;
    allVotes.forEach((vote) => {
      this.converged = this.updateScores(scores, teamVisits, vote.currentTeam, vote.previousTeam, vote.currentTeamChosen);
    });

    const teamResults: TeamResult[] = [];

    for (let i = 0; i < numTeams; i += 1) {
      const teamID = teams[i].id;
      teamResults.push({ id: teamID, name: teams[i].name, score: scores.get(teamID) });
    }

    return [teamResults, teamVisits];
  }

  static updateScores(Q: Map<number, number>, N: Map<number, number>, curr: number, prev: number, currentTeamChosen: boolean): boolean {
    let reward;
    const convThreshold = 0.01;

    N.set(curr, N.get(curr) + 1);
    N.set(prev, N.get(prev) + 1);

    if (currentTeamChosen) {
      reward = 1;
    } else {
      reward = 0;
    }

    const currQ = Q.get(curr);
    const prevQ = Q.get(prev);

    Q.set(curr, currQ + (1.0 / N.get(curr)) * (reward - currQ));
    Q.set(prev, prevQ + (1.0 / N.get(prev)) * ((reward === 1 ? 0 : 1) - prevQ));

    const minVisit = [...N.values()].sort((a, b) => a - b)[0];
    // top 5 teams have at least 'topNTeams' visits
    const topNTeams = Math.max(0, [...N.values()].sort((a, b) => a - b)[N.size - 5]);

    if (Math.abs(Q.get(curr) - currQ) < convThreshold && Math.abs(Q.get(prev) - prevQ) < convThreshold && minVisit > 2 && topNTeams > 4) {
      return true;
    }
    return false;
  }
}
