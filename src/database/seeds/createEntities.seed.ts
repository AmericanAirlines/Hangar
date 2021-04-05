/* eslint-disable class-methods-use-this */
import { Seeder, Factory } from 'typeorm-seeding';
import { Judge } from '../../entities/judge';
import { Team } from '../../entities/team';

export default class CreateEntities implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(Judge)().createMany(10);
    await factory(Team)().createMany(10);
  }
}
