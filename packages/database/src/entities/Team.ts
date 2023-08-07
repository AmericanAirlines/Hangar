// import { Entity, Property , EntityManager as ems , QueryResult , BigIntType, PrimaryKey } from '@mikro-orm/core';
// import { EntityManager as em, EntityRepository } from '@mikro-orm/postgresql'
// import { ConstructorValues } from '../utils/types';
// // import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, UpdateResult, Not, In } from 'typeorm';
// // import { genHash } from '../utilities/genHash';
// import { Node } from './Node';


  
// export type TeamConstructorValues = ConstructorValues<Team>

// // TODO: Enforce only one team registered per person
// @Entity()
// export class Team extends Node<Team> {
//   constructor({name, tableNumber, projectDescription, members, channelName ,judgeVisits, activeJudgeCount, syncHash}:TeamConstructorValues) {
//     super();

//     // this.name = name;
//     // this.tableNumber = tableNumber || null;
//     // this.channelName = channelName || null;
//     // this.projectDescription = projectDescription;
//     // this.members = members;
//     // this.judgeVisits = 0;
//     // this.activeJudgeCount = 0;
//     // this.syncHash = genHash();
//     this.name = name
//     this.tableNumber = tableNumber
//     this.channelName = channelName
//     this.projectDescription = projectDescription
//     this.members = members
//     this.judgeVisits = judgeVisits
//     this.activeJudgeCount = activeJudgeCount
//     this.syncHash = syncHash
//   }

//   // @PrimaryGeneratedColumn()
//   @PrimaryKey({ type: BigIntType })
//   id!: string;

//   @Property({ columnType: 'string' })
//   name: string;

//   @Property({ columnType: 'number', unique: true, nullable: true })
//   tableNumber: number | null = null;

//   @Property({ columnType: 'string', unique: true, nullable: true })
//   channelName: string | null = null;

//   @Property({ columnType: 'string' })
//   projectDescription: string;

//   @Property({ columnType: 'array' })
//   members: string[];


// }
