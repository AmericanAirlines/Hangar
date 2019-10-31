import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

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
    const votes = await JudgingVote.find();
    const results: TeamResult[] = [];
    const scores: TeamScore[] = [];

    votes.forEach((vote) => {
      scores.push({ score: 0, id: vote.currentTeam });
    });

    // TODO: Get team names and create TeamScore elements from them

    return results;
  }
}
