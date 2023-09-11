/* eslint-disable class-methods-use-this */
import { EntityManager } from '@mikro-orm/core';
import dayjs from 'dayjs';
import { Seeder } from '@mikro-orm/seeder';
import { EventFactory } from '../factories/EventFactory';

const eventsToMake = 20;

export class EventSeeder extends Seeder {
  run = async (em: EntityManager): Promise<void> => {
    const eventFactory = new EventFactory(em);

    let now = dayjs().subtract(4, 'hours').startOf('hour');

    for (let i = 0; i < eventsToMake; i += 1) {
      const duration = Math.round(Math.random()) * 30 + 30; // 30 or 60 mins
      const randStartTimeShift = Math.random() > 0.8 ? 30 * Math.ceil(Math.random() * 5) : 0; // Random amount of time between 0 mins and 150 mins
      const start = now.add(randStartTimeShift, 'minutes'); // Shift the start time by a random amount 20% of the time
      const end = start.add(duration, 'minutes');
      now = end;
      em.persist(eventFactory.makeOne({ start: start.toDate(), end: end.toDate() }));
    }
  };
}
