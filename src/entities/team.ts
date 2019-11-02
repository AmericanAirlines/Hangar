import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, getConnection } from 'typeorm';
import logger from '../logger';

// TODO: Enforce only one team registered per person
@Entity()
export class Team extends BaseEntity {
  constructor(name: string, tableNumber: number, projectDescription: string, members?: string[]) {
    super();

    this.name = name;
    this.tableNumber = tableNumber;
    this.projectDescription = projectDescription;
    this.members = members || [];
    this.judgeVisits = 0;
    this.activeJudgeCount = 0;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  tableNumber: number;

  @Column()
  projectDescription: string;

  @Column('simple-array')
  members: string[];

  // TODO: Make the below two attributes private once this issue is closed: https://github.com/typeorm/typeorm/issues/3548
  @Column()
  judgeVisits: number;

  @Column()
  activeJudgeCount: number;

  static async getNextAvailableTeamExcludingTeams(vistedTeamIds: number[]): Promise<Team> {
    let team: Team;
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const retrieveQueryBuilder = queryRunner.manager
      .createQueryBuilder(Team, 'team')
      .select()
      // TODO: Update to be have a retry with active judges
      .where(`activeJudgeCount == 0 AND id NOT IN (${vistedTeamIds.join(',')})`)
      .orderBy('team.judgeVisits', 'ASC');

    try {
      team = (await retrieveQueryBuilder.getOne()) || null;
      if (team) {
        await queryRunner.manager
          .createQueryBuilder(Team, 'team')
          .update()
          .set({
            activeJudgeCount: team.activeJudgeCount + 1,
          })
          .where({
            id: team.id,
          })
          .execute();
        await team.reload();
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      logger.error('Something went wrong...', err);
      // since we have errors lets rollback changes we made
      // await queryRunner.rollbackTransaction();
    } finally {
      // you need to release query runner which is manually created:
      await queryRunner.release();
    }
    return team;
  }

  async decrementActiveJudgeCount(): Promise<void> {
    await Team.createQueryBuilder()
      .update()
      .set({ activeJudgeCount: () => 'activeJudgeCount - 1' })
      .where('id = :id AND activeJudgeCount > 0', { id: this.id })
      .execute();
  }

  async incrementJudgeVisits(): Promise<void> {
    await Team.createQueryBuilder()
      .update()
      .set({ judgeVisits: () => 'judgeVisits + 1' })
      .where('id = :id', { id: this.id })
      .execute();
  }
}
