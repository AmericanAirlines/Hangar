import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
// import { Team } from './team';

@Entity()
export class Judge extends BaseEntity {
  constructor() {
    super();

    this.visitedTeams = [];
    this.currentTeam = null;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-json')
  visitedTeams: number[];

  @Column({ nullable: true })
  currentTeam?: number;

  async getNextTeam(): Promise<number> {
    // TODO: Get next team for judge
    // Sort Teams by #visits
    // Omit those the judge has already seen
    // Omit those in progress (to a new array)
    // If there are none in that array, sort others by activeJudgeCount
    // Update one to increment activeJudgeCount
    return this.id;
  }
}
