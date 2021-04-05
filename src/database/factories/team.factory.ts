import { define } from 'typeorm-seeding';
import Faker from 'faker';
import { Team } from '../../entities/team';

define(Team, (faker: typeof Faker) => {
  const name = faker.name.findName();
  const tableNumber = faker.random.number();
  const projectDescription = faker.lorem.sentence();

  const team = new Team(name, tableNumber, projectDescription);
  return team;
});
