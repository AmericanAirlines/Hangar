import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, UpdateResult } from 'typeorm';
import { genHash } from '../utils/genHash';

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
    this.syncHash = genHash();
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

  /**
   * This is used for running concurrent operations
   */
  @Column()
  syncHash: string;

  static async getNextAvailableTeamExcludingTeams(excludedTeamIds: number[]): Promise<Team> {
    let team: Team = null;
    let retries = 5;

    /* eslint-disable no-await-in-loop */
    do {
      const queryBuilder = Team.createQueryBuilder('team').select();

      if (excludedTeamIds.length > 0) {
        queryBuilder.where('id NOT IN (:...teams)', { teams: excludedTeamIds });
      }

      team = await queryBuilder
        .clone()
        .andWhere('"team"."activeJudgeCount" = 0')
        .orderBy('"team"."judgeVisits"', 'ASC')
        .getOne();

      if (!team) {
        team = await queryBuilder
          .clone()
          .orderBy('"team"."activeJudgeCount"', 'ASC')
          .addOrderBy('"team"."judgeVisits"', 'ASC')
          .getOne();
      }

      if (team) {
        const newHash = genHash();
        const result = await Team.updateSelectedTeam(team, newHash);
        await team.reload();

        if (result.affected > 0 || team.syncHash === newHash) {
          return team;
        }
      } else {
        return null;
      }

      await new Promise((resolve) => setTimeout(resolve, Math.random() * 500));

      retries -= 1;
    } while (retries > 0);
    /* eslint-enable no-await-in-loop */

    throw new Error('Unable to retrieve a team due to concurrency issues');
  }

  static async updateSelectedTeam(team: Team, hash: string): Promise<UpdateResult> {
    return Team.createQueryBuilder()
      .update()
      .set({ activeJudgeCount: team.activeJudgeCount + 1, syncHash: hash })
      .whereInIds(team.id)
      .andWhere('syncHash = :syncHash', { syncHash: team.syncHash })
      .execute();
  }

  async decrementActiveJudgeCount(): Promise<void> {
    await Team.createQueryBuilder('team')
      .update()
      .set({ activeJudgeCount: () => '"team"."activeJudgeCount" - 1' })
      .where('"team"."id" = :id AND "team"."activeJudgeCount" > 0', { id: this.id })
      .execute();
  }

  async incrementJudgeVisits(): Promise<void> {
    await Team.createQueryBuilder('team')
      .update()
      .set({ judgeVisits: () => '"team"."judgeVisits" + 1' })
      .where('"team"."id" = :id', { id: this.id })
      .execute();
  }
}
