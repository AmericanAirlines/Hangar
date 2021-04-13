import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, UpdateResult, Not, In } from 'typeorm';
import { genHash } from '../utilities/genHash';

// TODO: Enforce only one team registered per person
@Entity()
export class Team extends BaseEntity {
  constructor(name: string, tableNumber: number, projectDescription: string, members: string[], channelName?: string) {
    super();

    this.name = name;
    this.tableNumber = tableNumber || null;
    this.channelName = channelName || null;
    this.projectDescription = projectDescription;
    this.members = members;
    this.judgeVisits = 0;
    this.activeJudgeCount = 0;
    this.syncHash = genHash();
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true, nullable: true })
  tableNumber: number;

  @Column({ unique: true, nullable: true })
  channelName: string;

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

  static async getNextAvailableTeamExcludingTeams(excludedTeamIds: number[] = []): Promise<Team> {
    let team: Team = null;
    let retries = 5;

    /* eslint-disable no-await-in-loop */
    do {
      team = await Team.findOne({
        where: {
          id: Not(In(excludedTeamIds)),
        },
        order: {
          activeJudgeCount: 'ASC',
          judgeVisits: 'ASC',
        },
      });

      if (team) {
        const newHash = genHash();
        const result = await Team.updateSelectedTeam(team, newHash);
        await team.reload();

        if (result.affected > 0) {
          // We found a team and assigned the judge correctly; return it
          return team;
        }
      } else {
        // No teams remaining
        return null;
      }

      // We picked a team that we couldn't modify; wait briefly and then try again
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 500));

      retries -= 1;
    } while (retries > 0);
    /* eslint-enable no-await-in-loop */

    throw new Error('Unable to retrieve a team due to concurrency issues');
  }

  /* istanbul ignore next */
  static async updateSelectedTeam(team: Team, hash: string): Promise<UpdateResult> {
    return Team.createQueryBuilder()
      .update()
      .set({ activeJudgeCount: team.activeJudgeCount + 1, syncHash: hash })
      .whereInIds(team.id)
      .andWhere('syncHash = :syncHash', { syncHash: team.syncHash })
      .execute();
  }

  /* istanbul ignore next */
  async decrementActiveJudgeCount(): Promise<void> {
    await Team.createQueryBuilder('team')
      .update()
      .set({ activeJudgeCount: () => '"team"."activeJudgeCount" - 1' })
      .where('"team"."id" = :id AND "team"."activeJudgeCount" > 0', { id: this.id })
      .execute();
  }

  /* istanbul ignore next */
  async incrementJudgeVisits(): Promise<void> {
    await Team.createQueryBuilder('team')
      .update()
      .set({ judgeVisits: () => '"team"."judgeVisits" + 1' })
      .where('"team"."id" = :id', { id: this.id })
      .execute();
  }
}
