/* eslint-disable class-methods-use-this */
import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { PrizeFactory } from '../factories/PrizeFactory';

const prizesToMake = 5;

export class PrizeSeeder extends Seeder {
  run = async (em: EntityManager): Promise<void> => {
    const prizeFactory = new PrizeFactory(em);

    for (let i = 0; i < prizesToMake; i += 1) {
      em.persist(prizeFactory.makeOne({ position: i, isBonus: i > 2 }));
    }
  };
}
