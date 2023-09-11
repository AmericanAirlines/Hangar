/* eslint-disable class-methods-use-this */
import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';
import { FakerEntity } from '../types/FakerEntity';
import { Prize } from '../../src';

export class PrizeFactory extends Factory<Prize> {
  model = Prize;

  definition = (): FakerEntity<Prize> => ({
    name: faker.lorem.words(),
    description: faker.lorem.paragraph(),
    position: 0,
    isBonus: false,
  });
}
