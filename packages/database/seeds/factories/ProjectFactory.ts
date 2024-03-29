/* eslint-disable class-methods-use-this */
import seedrandom from 'seedrandom';
import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';
import { v4 } from 'uuid';
import { FakerEntity } from '../types/FakerEntity';
import { Project } from '../../src';

const locationSeeder = seedrandom('location');

export class ProjectFactory extends Factory<Project> {
  model = Project;

  definition = (): FakerEntity<
    Project,
    'contributors' | 'incrementActiveJudgeCount' | 'decrementActiveJudgeCount'
  > => ({
    name: faker.lorem.words(),
    description: faker.lorem.paragraph(),
    activeJudgeCount: 0,
    inviteCode: v4(),
    repoUrl: faker.internet.url(),
    location: locationSeeder() > 0.5 ? v4().substring(0, 5) : undefined,
  });
}
