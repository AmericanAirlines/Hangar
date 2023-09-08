/* eslint-disable class-methods-use-this */
import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';
import { FakerEntity } from '../types/FakerEntity';
import { Event } from '../../src';

export class EventFactory extends Factory<Event> {
  model = Event;

  definition = (): FakerEntity<Event> => ({
    name: faker.lorem.words(),
    description: faker.lorem.paragraph(),
    start: new Date(),
    end: new Date(),
  });
}
