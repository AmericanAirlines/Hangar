import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { JudgingVote } from './judgingVote';
import { Team } from './team';

@Entity()
export class Judge extends BaseEntity {
  constructor() {
    super();

    this.visitedTeams = [];
    this.currentTeam = null;
    this.away = false;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-json')
  visitedTeams: number[];

  @Column({ nullable: true })
  currentTeam?: number;

  @Column({ nullable: true })
  previousTeam?: number;

  @Column()
  away: boolean;

  async getNextTeam(): Promise<Team> {
    const newTeam = await Team.getNextAvailableTeamExcludingTeams(this.visitedTeams);
    this.currentTeam = newTeam ? newTeam.id : null;
    await this.save();
    return newTeam;
  }

  async continue(): Promise<void> {
    await this.recordCurrentTeamAndSave();
  }

  async stepAway(): Promise<void> {
    if (this.away) {
      return;
    }

    const team = await Team.findOne({ id: this.currentTeam });

    if (team?.activeJudgeCount > 0) {
      this.away = true;
      await team.decrementActiveJudgeCount();
      await this.save();
    }
  }

  async resumeJudging(): Promise<void> {
    if (!this.away) {
      return;
    }

    const team = await Team.findOne({ id: this.currentTeam });
    this.away = true;

    if (team) {
      await team.incrementActiveJudgeCount();
    }

    await this.save();
  }

  async skip(): Promise<void> {
    const updatePrevious = false;
    await this.recordCurrentTeamAndSave(updatePrevious);
  }

  async vote(currentTeamChosen?: boolean): Promise<void> {
    // Create a new vote object with the outcome of the vote
    await new JudgingVote(this.visitedTeams[this.visitedTeams.length - 1], this.currentTeam, currentTeamChosen).save();
    await this.recordCurrentTeamAndSave();
  }

  async recordCurrentTeamAndSave(updatePrevious = true): Promise<void> {
    this.visitedTeams.push(this.currentTeam);
    if (updatePrevious) {
      this.previousTeam = this.currentTeam;
    }
    const currentTeam = await Team.findOne(this.currentTeam);
    await currentTeam.decrementActiveJudgeCount();
    await currentTeam.incrementJudgeVisits();
    this.currentTeam = null;
    await this.save();
  }
}
