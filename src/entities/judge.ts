import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Judge extends BaseEntity {
  constructor() {
    super();

    this.visitedTeams = [];
    this.currentTeam = null;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer', { array: true })
  visitedTeams: number[];

  @Column({ nullable: true })
  currentTeam?: number;

  async getNextTeam(): Promise<number> {
    return this.id;
  }
}
