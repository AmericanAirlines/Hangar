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
    let queryRunner;
    try {
      let retriesRemaining = 5;
      queryRunner = getConnection().createQueryRunner();

      let retrieveQueryBuilder = queryRunner.manager.createQueryBuilder(Team, 'team').select();
      if (vistedTeamIds.length > 0) {
        if (process.env.NODE_ENV === 'test') {
          // SQLite
          retrieveQueryBuilder = retrieveQueryBuilder.where(`id NOT IN (${vistedTeamIds.join(',')})`);
        } else {
          // Postgres
          retrieveQueryBuilder = retrieveQueryBuilder.where('team.id NOT IN (:...teams)', { teams: vistedTeamIds });
        }
      }

      do {
        /* eslint-disable no-await-in-loop */
        try {
          await queryRunner.connect();
          await queryRunner.startTransaction();
          team = (await retrieveQueryBuilder
            .andWhere('activeJudgeCount == 0')
            .orderBy('team.judgeVisits', 'ASC')
            .getOne()) || null;

          if (team) {
            // Query suceeded; break
            break;
          }

          // Query succeeded, but no matching results
          team = (await retrieveQueryBuilder.orderBy('team.activeJudgeCount', 'ASC').getOne()) || null;
          break;
        } catch (err) {
          // Query failed, likely because of a current transaction
          // Retry but decrement the counter
          // Wait for .25 seconds before trying again
          retriesRemaining -= 1;
          await new Promise((resolve) => {
            setTimeout(resolve, Math.random() * 500);
          });
        }
        /* eslint-enable no-await-in-loop */
      } while (retriesRemaining > 0);

      // A team was found; update it
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
        await queryRunner.commitTransaction();
      }
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
