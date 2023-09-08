/* eslint-disable class-methods-use-this */
import { EntityManager } from '@mikro-orm/core';
import dayjs from 'dayjs';
import { Seeder } from '@mikro-orm/seeder';
import { EventFactory } from '../factories/EventFactory';

const eventsToMake = 10;

export class EventSeeder extends Seeder {
  run = async (em: EntityManager): Promise<void> => {
    const eventFactory = new EventFactory(em);

    let now = dayjs();

    for (let i = 0; i < eventsToMake; i += 1) {
      const duration = Math.round(Math.random()) * 30 + 30; // 30 or 60 mins
      const start = now.toDate();
      now = now.add(duration, 'minutes');
      const end = now.toDate();
      em.persist(eventFactory.makeOne({ start, end }));
    }
  };
}
