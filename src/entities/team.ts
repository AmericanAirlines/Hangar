import { JudgingVote, TeamResult, TeamScore } from './judgingVote';
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

  // TODO: communicate e-greedy and ucb to substitute getting next available team
  static async getNextAvailableTeamExcludingTeams(prevTeamId: number): Promise<Team> {
    // console.log(prevTeamId);
    // pull an array of teams from the table
    let teams: Team[] = null;
    let retries = 5;

    /* eslint-disable no-await-in-loop */
    // do {
    const queryBuilder = Team.createQueryBuilder('team').select();

    teams = await Team.find();
    const [scores, teamVisits] = await JudgingVote.updateScoresAndVisits();

    if (JudgingVote.converged) return null;

    // prepare paratmeters for eGreedy and ucb
    let nextTeamId: number;
    const c = 0.9; // epsilon

    // call eGreedy or ucb, returns id of the next team a judge should see
    nextTeamId = this.eGreedy(scores, teams.length, prevTeamId, c);
    // nextTeamId = await this.ucb(scores, teamVisits, prevTeamId, c);

    // retrieve team object from table that matches id, return team
    let nextTeam: Team = null;
    let retries2 = 5;
    /* eslint-disable no-await-in-loop */
    do {
      const queryBuilder = Team.createQueryBuilder('team').select();

      nextTeam = await Team.findOne({ where: { id: nextTeamId } });

      if (nextTeam) {
        const newHash = genHash();
        const result = await Team.updateSelectedTeam(nextTeam, newHash);
        await nextTeam.reload();

        if (result.affected > 0) {
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

  static eGreedy(Q: TeamResult[], teams: number, prev: number, epsilon: number) {
    const random = Math.random();

    let curr = 0;
    // console.log(`random is ${random} compared to epsilon ${epsilon}`);
    if (random > epsilon) {
      Q.sort((a, b) => b.score - a.score);
      curr = Q[0].id;

      if (curr == prev) {
        if (teams == 1) return null;
        curr = Q[1].id;
      }
    } else {
      curr = Q[Math.floor(Math.random() * Q.length)].id;
      while (curr == prev) {
        if (teams == 1) return null;
        curr = Q[Math.floor(Math.random() * Q.length)].id;
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
  static async ucb(Q: TeamResult[], teamVisits: Map<number, number>, prev: number, c: number) {
    const ucb_scores: TeamScore[] = [];
    const allVotes = await JudgingVote.find();
    const time = allVotes.length;

    teamVisits.forEach((visits, id) => {
      // console.log(`visits ${visits} id ${id}`);
      var teamScore = Q.find((score) => score.id == id).score;
      if (visits == 0) ucb_scores.push({ id: id, score: Number.POSITIVE_INFINITY });
      else {
        // console.log('NOT INFINITE');
        teamScore += c * Math.sqrt(Math.log(2 * time) / visits);
        ucb_scores.push({ id: id, score: teamScore });
      }
    });

    // console.log(prev);
    ucb_scores.sort((a, b) => a.id - b.id);
    var max = ucb_scores[0].score;
    var curr = ucb_scores[0].id;
    for (var i = 0; i < ucb_scores.length; i++) {
      if (ucb_scores[i].score > max) {
        // console.log(`${ucb_scores[i].id} IS BIGGER`);
        max = ucb_scores[i].score;
        curr = ucb_scores[i].id;
      }
    }

    if (curr == prev) {
      ucb_scores.sort((a, b) => (b.score == a.score ? a.id - b.id : a.score - b.score));
      curr = ucb_scores[ucb_scores.length - 2].id;
    }

    // console.log(curr);
    return curr;
  }
}
