import { Entity, Property , EntityManager as ems, ManyToMany, OneToOne, Ref, Collection , wrap} from '@mikro-orm/core';
import { EntityManager as em, EntityRepository } from '@mikro-orm/postgresql'
// import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { ConstructorValues } from '../utils/types';
import { JudgingVote } from './JudgingVote';
import { Project } from './Project';
import { Node } from './Node';
import { User } from './User';

// constructor({ name, authId, ...extraValues }: UserConstructorValues) {
//     super(extraValues);

//     this.authId = authId;
//     this.name = name;
//   }   
// export type JudgeConstructorValues = {
//     id:string,
//     currentProject:number,
//     visitedProjects:number[]
// }
export type JudgeConstructorValues = ConstructorValues<Judge,'currentProject'|'previousProject'|'visitedProjects'>
// const judge = new Judge({})
@Entity()
export class Judge extends Node<Judge> {
    constructor({user}:JudgeConstructorValues) {
        super();

        this.user = user
    }

    @OneToOne({entity:()=>User})
    user: Ref<User>
    
    @ManyToMany({ entity:()=>Project })
    visitedProjects= new Collection<Project>(this);
    
    @OneToOne({ nullable: true })
    currentProject?: Ref<Project>;

    @OneToOne({ nullable: true })
    previousProject?: Ref<Project>;

    async getNextProject({entityManager}:{entityManager:em}): Promise<Project|undefined> {
        const newProject = await Project.getNextAvailableProjectExcludingProjects({
            excludedProjectIds: this.visitedProjects.getIdentifiers() ,
            entityManager
        });
        
        this.currentProject = newProject?.toReference()// ? newProject.id : null;
        entityManager.persistAndFlush(this)
        // await this.save();
        return newProject;
    }

    async continue({entityManager}:{entityManager:em}): Promise<void> {
        await this.recordCurrentProjectAndSave({ entityManager, updatePrevious: true });
    }

    async skip({entityManager}:{entityManager:em}): Promise<void> {
        const updatePrevious = false;
        await this.recordCurrentProjectAndSave({entityManager,updatePrevious});
    }

    // async vote({entityManager , currentProjectChosen?: boolean}) Promise<void> {
    // async vote(currentProjectChosen?: boolean): Promise<void> {
    async vote({entityManager , currentProjectChosen}:{entityManager:em, currentProjectChosen:boolean}): Promise<void> {
        if (!this.currentProject||!this.previousProject) {
            throw new Error('Current Project or previous Project was not defined during vote operation')
        }
        // Create a new vote object with the outcome of the vote
        // await new JudgingVote(this.visitedProjects[this.visitedProjects.length - 1], this.currentProject, currentProjectChosen).save();
        entityManager.persistAndFlush(
            new JudgingVote({
                // previousProject: number, currentProject: number, currentProjectChosen: boolean
                previousProject: this.previousProject , //this.visitedProjects[this.visitedProjects.length - 1] ,
                currentProject: this.currentProject ,
                currentProjectChosen ,
            })
        )
        await this.recordCurrentProjectAndSave({entityManager,updatePrevious:true});
    }

    async recordCurrentProjectAndSave({entityManager , updatePrevious = true}:{entityManager:em,updatePrevious:boolean}): Promise<void> {
        if (!this.currentProject) {
            throw new Error('Current Project was not defined during save operation')
        }
        this.visitedProjects.add( this.currentProject );
        if (updatePrevious) {
            this.previousProject = this.currentProject;
        }
        // const currentProject = await Project.findOne(this.currentProject);
        if(this.currentProject){
            const currentProject = await entityManager.findOne(Project,{id:this.currentProject.id});
            if(currentProject){
                await currentProject.decrementActiveJudgeCount({project:currentProject,entityManager});
                await currentProject.incrementJudgeVisits({project:currentProject,entityManager});
            }
            // Project.
            this.currentProject = undefined;
            entityManager.persistAndFlush(this)
            // await this.save();
        }
    }
}