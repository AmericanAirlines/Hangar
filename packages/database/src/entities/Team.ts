import { Entity, Property , EntityManager as ems , QueryResult , BigIntType, PrimaryKey } from '@mikro-orm/core';
import { EntityManager as em, EntityRepository } from '@mikro-orm/postgresql'
import { ConstructorValues } from '../utils/types';
// import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, UpdateResult, Not, In } from 'typeorm';
// import { genHash } from '../utilities/genHash';
import { Node } from './Node';

export const genHash = (): string => {
    const prefix = Math.random()
        .toString(36)
        .substring(2, 15);
  
    const suffix = Math.random()
        .toString(36)
        .substring(2, 15);
  
    return prefix + suffix;
};
  
export type TeamConstructorValues = ConstructorValues<Team>

// TODO: Enforce only one team registered per person
@Entity()
export class Team extends Node<Team> {
    constructor({name, tableNumber, projectDescription, members, channelName ,judgeVisits, activeJudgeCount, syncHash}:TeamConstructorValues) {
        super();

        // this.name = name;
        // this.tableNumber = tableNumber || null;
        // this.channelName = channelName || null;
        // this.projectDescription = projectDescription;
        // this.members = members;
        // this.judgeVisits = 0;
        // this.activeJudgeCount = 0;
        // this.syncHash = genHash();
        this.name = name
        this.tableNumber = tableNumber
        this.channelName = channelName
        this.projectDescription = projectDescription
        this.members = members
        this.judgeVisits = judgeVisits
        this.activeJudgeCount = activeJudgeCount
        this.syncHash = syncHash
    }

    // @PrimaryGeneratedColumn()
    @PrimaryKey({ type: BigIntType })
    id!: string;

    @Property({ columnType: 'string' })
    name: string;

    @Property({ columnType: 'number', unique: true, nullable: true })
    tableNumber: number | null = null;

    @Property({ columnType: 'string', unique: true, nullable: true })
    channelName: string | null = null;

    @Property({ columnType: 'string' })
    projectDescription: string;

    @Property({ columnType: 'array' })
    members: string[];

    // does the following apply with mikro-orm?
    // TODO: Make the below two attributes private once this issue is closed: https://github.com/typeorm/typeorm/issues/3548
    @Property({ columnType: 'number' })
    judgeVisits: number = 0;

    @Property({ columnType: 'number' })
    activeJudgeCount: number = 0;

    /**
     * This is used for running concurrent operations
     */
    @Property({ columnType: 'string' })
    syncHash: string = genHash();

    // static async getNextAvailableTeamExcludingTeams(excludedTeamIds: number[] = []): Promise<Team> {
    static async getNextAvailableTeamExcludingTeams({excludedTeamIds=[], entityManager}:{excludedTeamIds: (string|null|undefined)[],entityManager:em}): Promise<Team|null> {
        let team: Team|null = null;
        let retries = 5;
        /* eslint-disable no-await-in-loop */
        // let query = []
        // if (excludedTeamIds.length)
        //     query
        const query:object = excludedTeamIds.length ? { id: { $nin: excludedTeamIds } } : {}
        const queryOptions = { orderBy: { activeJudgeCount: 'ASC', judgeVisits: 'ASC' } }
        do {
            team = await entityManager.findOne(Team, query,queryOptions);

            // team = await Team.findOne({
            //     where: excludedTeamIds.length ? { id: Not(In(excludedTeamIds)) } : {},
            //     order: {
            //         activeJudgeCount: 'ASC',
            //         judgeVisits: 'ASC',
            //     },
            // });

            if (team) {
                const newHash = genHash();
                const result = await Team.updateSelectedTeam({team, hash:newHash , entityManager });
                team = await entityManager.findOne(Team,query, queryOptions)
                // await team.reload();

                // if (result.affected > 0) {
                if (result.affectedRows > 0) {
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
    // static async updateSelectedTeam(team: Team, hash: string): Promise<UpdateResult> {
    static async updateSelectedTeam({team, hash,entityManager}:{team: Team, hash: string, entityManager:em}): Promise<QueryResult<Team>> {
        return entityManager.createQueryBuilder(Team)
            .update({ activeJudgeCount: team.activeJudgeCount + 1, syncHash: hash })
            // .update()
            // .set({ activeJudgeCount: team.activeJudgeCount + 1, syncHash: hash })
            .where({id:team.id,syncHash: team.syncHash})
            // .whereInIds(team.id)
            // .andWhere('syncHash = :syncHash', { syncHash: team.syncHash })
            .execute();
    }

    /* istanbul ignore next */
    async decrementActiveJudgeCount({team,entityManager}:{team: Team, entityManager:em}): Promise<void> {
        await entityManager.createQueryBuilder(Team)
            .update({ activeJudgeCount: team.activeJudgeCount - 1 })
            // .update()
            // .set({ activeJudgeCount: () => '"team"."activeJudgeCount" - 1' })
            .where({ id: team.id })
            // .where('"team"."id" = :id AND "team"."activeJudgeCount" > 0', { id: team.id })
            .execute();
    }

    /* istanbul ignore next */
    async incrementJudgeVisits({team,entityManager}:{team: Team, entityManager:em}): Promise<void> {
        await entityManager.createQueryBuilder('team')
            .update({ judgeVisits: team.judgeVisits - 1 })
            // .update()
            // .set({ judgeVisits: () => '"team"."judgeVisits" + 1' })
            .where({ id: team.id })
            // .where('"team"."id" = :id', { id: this.id })
            .execute();
    }
}
