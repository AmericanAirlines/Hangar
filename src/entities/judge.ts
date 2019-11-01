import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { JudgingVote } from './judgingVote';
import { Team } from './team';
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

  async vote(currentTeamChosen: boolean): Promise<void> {
    // Create a new vote object with the outcome of the vote
    await new JudgingVote(this.visitedTeams[this.visitedTeams.length - 1], this.currentTeam, currentTeamChosen).save();

    // Add the current team to visitedTeams
    this.visitedTeams.push(this.currentTeam);

    // Modify current team's judge values
    const currentTeam = await Team.findOne(this.currentTeam);
    await currentTeam.decrementActiveJudgeCount();
    await currentTeam.incrementJudgeVisits();

    // Remove current team
    this.currentTeam = null;

    await this.save();
  }
}
