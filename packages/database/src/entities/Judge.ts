import { Entity, Property , EntityManager as ems } from '@mikro-orm/core';
import { EntityManager as em, EntityRepository } from '@mikro-orm/postgresql'
// import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { ConstructorValues } from '../utils/types';
import { JudgingVote } from './JudgingVote';
import { Team } from './Team';
import { Node } from './Node';

// constructor({ name, authId, ...extraValues }: UserConstructorValues) {
//     super(extraValues);

//     this.authId = authId;
//     this.name = name;
//   }   
// export type JudgeConstructorValues = {
//     id:string,
//     currentTeam:number,
//     visitedTeams:number[]
// }
export type JudgeConstructorValues = ConstructorValues<Judge>

@Entity()
export class Judge extends Node<Judge> {
    constructor({currentTeam,visitedTeams}:JudgeConstructorValues) {
        super();

        // this.id = id;
        this.currentTeam = currentTeam;
        this.visitedTeams = visitedTeams;
    }

    // @PrimaryGeneratedColumn()
    // @Property({ columnType: 'string' })
    // id: string;

    // @Column('simple-json')
    @Property({ columnType: 'array' })
    visitedTeams: (string | null | undefined)[] = [];

    // @Column({ nullable: true })
    @Property({ columnType: 'int', nullable: true })
    currentTeam?: string|null = null;

    // @Column({ nullable: true })
    @Property({ columnType: 'int', nullable: true })
    previousTeam?: string | null  | undefined;

    async getNextTeam({entityManager}:{entityManager:em}): Promise<Team|null> {
        const newTeam = await Team.getNextAvailableTeamExcludingTeams({excludedTeamIds:this.visitedTeams,entityManager});
        this.currentTeam = newTeam ? newTeam.id : null;
        entityManager.persistAndFlush(this)
        // await this.save();
        return newTeam;
    }

    async continue({entityManager}:{entityManager:em}): Promise<void> {
        await this.recordCurrentTeamAndSave({ entityManager, updatePrevious: true });
    }

    async skip({entityManager}:{entityManager:em}): Promise<void> {
        const updatePrevious = false;
        await this.recordCurrentTeamAndSave({entityManager,updatePrevious});
    }

    // async vote({entityManager , currentTeamChosen?: boolean}) Promise<void> {
    // async vote(currentTeamChosen?: boolean): Promise<void> {
    async vote({entityManager , currentTeamChosen}:{entityManager:em, currentTeamChosen:boolean}): Promise<void> {
        // Create a new vote object with the outcome of the vote
        // await new JudgingVote(this.visitedTeams[this.visitedTeams.length - 1], this.currentTeam, currentTeamChosen).save();
        entityManager.persistAndFlush(
            new JudgingVote({
                // previousTeam: number, currentTeam: number, currentTeamChosen: boolean
                previousTeam:this.visitedTeams[this.visitedTeams.length - 1],
                currentTeam:this.currentTeam,
                currentTeamChosen
            })
        )
        await this.recordCurrentTeamAndSave({entityManager,updatePrevious:true});
    }

    async recordCurrentTeamAndSave({entityManager , updatePrevious = true}:{entityManager:em,updatePrevious:boolean}): Promise<void> {
        this.visitedTeams.push(this.currentTeam);
        if (updatePrevious) {
            this.previousTeam = this.currentTeam;
        }
        // const currentTeam = await Team.findOne(this.currentTeam);
        const currentTeam = await entityManager.findOne(Team,{id:this.currentTeam});
        if(currentTeam){
            await currentTeam.decrementActiveJudgeCount({team:currentTeam,entityManager});
            await currentTeam.incrementJudgeVisits({team:currentTeam,entityManager});
        }
        // Team.
        this.currentTeam = null;
        entityManager.persistAndFlush(this)
        // await this.save();
    }
}