/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */

import { Seeder, Factory } from 'typeorm-seeding';
import { Judge } from '../../entities/judge';
import { Team } from '../../entities/team';

const numJudges = 10;
const numTeams = 10;
// it makes more sense to use a set here, but getting random element from set takes O(N) in javascript :(
const placements: number[] = Array.from(Array(numTeams).keys()).map((n) => n + 1);

export default class CreateEntities implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(Judge)().createMany(numJudges);
    await factory(Team)()
      .map(async (team: Team) => {
        const i = Math.floor(Math.random() * placements.length);
        team.projectDescription = String(placements[i]);
        placements.splice(i, 1);
        return team;
      })
      .createMany(numTeams);
  }
}
