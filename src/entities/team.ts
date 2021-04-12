import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, UpdateResult } from 'typeorm';
import { genHash } from '../utilities/genHash';

// TODO: Enforce only one team registered per person
@Entity()
export class Team extends BaseEntity {
  constructor(name: string, tableNumber: number, projectDescription: string, members?: string[], channelName?: string) {
    super();

    this.name = name;
    this.tableNumber = tableNumber || null;
    this.channelName = channelName || null;
    this.projectDescription = projectDescription;
    this.members = members || [];
    this.judgeVisits = 0;
    this.activeJudgeCount = 0;
    this.qValue = 0;
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

  @Column()
  qValue: number;

  /**
   * This is used for running concurrent operations
   */
  @Column()
  syncHash: string;

  // TODO: communicate e-greedy and ucb to substitute getting next available team

  // static async getNextAvailableTeamExcludingTeams(excludedTeamIds: number[]): Promise<Team> {
  //   let team: Team = null;
  //   let teams: [Team] = null;
  //   let retries = 5;

  //   /* eslint-disable no-await-in-loop */
  //   do {
  //     const queryBuilder = Team.createQueryBuilder('team').select();

  //     if (excludedTeamIds.length > 0) {
  //       queryBuilder.where('id NOT IN (:...teams)', { teams: excludedTeamIds });
  //     }

  //     team = await queryBuilder
  //       .clone()
  //       .andWhere('"team"."activeJudgeCount" = 0')
  //       .orderBy('"team"."judgeVisits"', 'ASC')
  //       .getOne();

  //     if (!team) {
  //       team = await queryBuilder
  //         .clone()
  //         .orderBy('"team"."activeJudgeCount"', 'ASC')
  //         .addOrderBy('"team"."judgeVisits"', 'ASC')
  //         .getOne();
  //     }

  //     if (team) {
  //       const newHash = genHash();
  //       const result = await Team.updateSelectedTeam(team, newHash);
  //       await team.reload();

  //       if (result.affected > 0 || team.syncHash === newHash) {
  //         return team;
  //       }
  //     } else {
  //       return null;
  //     }

  //     await new Promise((resolve) => setTimeout(resolve, Math.random() * 500));

  //     retries -= 1;
  //   } while (retries > 0);
  //   /* eslint-enable no-await-in-loop */

  //   throw new Error('Unable to retrieve a team due to concurrency issues');
  // }

  static async getNextAvailableTeamExcludingTeams(prevTeamId: number): Promise<Team> {
    // pull an array of teams from the table
    let teams: Team[] = null;
    let retries = 5;

    /* eslint-disable no-await-in-loop */
    do {
      const queryBuilder = Team.createQueryBuilder('team').select();

      teams = await queryBuilder
        .clone()
        .limit(1000)
        .getMany();

      await new Promise((resolve) => setTimeout(resolve, Math.random() * 500));

      retries -= 1;
    } while (retries > 0);
    /* eslint-enable no-await-in-loop */

    // prepare paratmeters for eGreedy and ucb
    let nextTeamId: number;
    let teamIds: [number];
    let qArr: [number];
    let judgeVisits: [number];
    const c = 100; // epsilon

    teams.forEach((element) => {
      teamIds.push(element.id);
    });

    teams.forEach((element) => {
      qArr.push(1 / teams.length);
    });

    teams.forEach((element) => {
      judgeVisits.push(element.judgeVisits);
    });

    // call eGreedy or ucb, returns id of the next team a judge should see
    nextTeamId = this.eGreedy(qArr, teams.length, prevTeamId, c);
    // nextTeamId = this.ucb();

    // retrieve team object from table that matches id, return team
    let nextTeam: Team = null;
    let retries2 = 5;
    /* eslint-disable no-await-in-loop */
    do {
      const queryBuilder = Team.createQueryBuilder('team').select();

      // TODO: need to handle case where eGreedy or UCB returns a team in the "exclude team" array

      nextTeam = await queryBuilder
        .clone()
        .andWhere('"team"."id" = (:....next)', { next: nextTeamId })
        .getOne();

      if (!nextTeam) {
        nextTeam = await queryBuilder
          .clone()
          .andWhere('"team"."id" = (:....next)', { next: nextTeamId })
          .getOne();
      }

      if (nextTeam) {
        const newHash = genHash();
        const result = await Team.updateSelectedTeam(nextTeam, newHash);
        await nextTeam.reload();

        if (result.affected > 0 || nextTeam.syncHash === newHash) {
          return nextTeam;
        }
      } else {
        return null;
      }

      await new Promise((resolve) => setTimeout(resolve, Math.random() * 500));

      retries2 -= 1;
    } while (retries2 > 0);
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

  /*
  Epsilon Greedy inputs:
    array of team scores (Q), number of teams (nA), previous team (prev),
    starting exploration parameter (start_epsilon), ending exploration parameter (end_epsilon), time (t)
  Returns: a team to visit
  */
  static randomNumber(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  static argsort(array: [number]) {
    const arrayObject = array.map((value, idx) => ({ value, idx }));

    arrayObject.sort((a, b) => {
      if (a.value < b.value) {
        return -1;
      }

      if (a.value > b.value) {
        return 1;
      }
      return 0;
    });
    const argIndices = arrayObject.map((data) => data.idx);
    return argIndices;
  }

  static eGreedy(Q: [number], A: number, prev: number, start_epsilon: number) {
    const random = Math.random();

    let curr = 0;

    if (random > start_epsilon) {
      curr = Q.sort()[Q.length - 1]; // sorts nums low to high, selects last num

      if (curr == prev) {
        curr = this.argsort(Q)[1];
      }
    } else {
      curr = this.randomNumber(0, A - 1);

      while (curr == prev) {
        curr = this.randomNumber(0, A - 1);
      }
    }
    return curr;
  }

  /*
  Upper Confidence Bound inputs:
    array of team scores (Q), array of team visits (N), number of teams (nA), previous team q index (prev),
    exploration parameter (c), time (t)
  Returns: a team to visit
  */
  static async ucb(Q: [number], N: [number], nA: number, prev: number, c: number, t: number) {
    let ucb_scores: [number];

    for (var i = 0; i < nA; i++) {
      if (N[i] == 0) {
        ucb_scores.push(Number.POSITIVE_INFINITY);
      } else {
        ucb_scores.push(Q[i] + c * Math.sqrt(Math.log(t) / N[i]));
      }
    }

    let maxScore = 0;
    let teamPos = 0;
    for (var i = 0; i < ucb_scores.length; i++) {
      if (ucb_scores[i] > maxScore && i != prev) {
        // current team can't be the previous team
        maxScore = ucb_scores[i];
        teamPos = i;
      }
    }

    // return the team associated with q value at position "teamPos"
    // it will have the highest ucb score
    return teamPos;
  }
}
