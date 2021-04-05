import { define } from 'typeorm-seeding';
import { Judge } from '../../entities/judge';

define(Judge, () => {
  const judge = new Judge();
  return judge;
});
