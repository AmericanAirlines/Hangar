/* eslint-disable class-methods-use-this */
import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';
import { FakerEntity } from '../types/FakerEntity';
import { User } from '../../src';

export class UserFactory extends Factory<User> {
  model = User;

  definition = (): FakerEntity<User> => ({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
  });
}