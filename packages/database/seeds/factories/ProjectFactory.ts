/* eslint-disable class-methods-use-this */
import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';
import { v4 } from 'uuid';
import { FakerEntity } from '../types/FakerEntity';
import { Project } from '../../src';

export class ProjectFactory extends Factory<Project> {
  model = Project;

  definition = (): FakerEntity<
    Project,
    | 'contributors'
    | 'incrementActiveJudgeCount'
    | 'decrementActiveJudgeCount'
    | 'incrementJudgeVisits'
  > => ({
    name: faker.lorem.words(),
    description: faker.lorem.paragraph(),
    activeJudgeCount: 0,
    judgeVisits: 0,
    inviteCode: v4(),
    repoUrl: faker.internet.url(),
  });
}
