import { App } from '@slack/bolt';
import dashboardBlocks from '../blocks/dashboardBlocks';
import { Config } from '../../entities/config';
import logger from '../../logger';

function register(bolt: App): void {
  bolt.message(async ({ say }) => {
    // TODO: get context (toggles), use to generate specific dashboard blocks
    const teamRegistrationToggle = (await Config.findOne({ key: 'teamRegistrationActive' })) || { key: 'teamRegistrationActive', value: 'false' };
    const context = {
      [teamRegistrationToggle.key]: teamRegistrationToggle.value === 'true',
    };
    try {
      say({
        text: '',
        blocks: dashboardBlocks(context),
      });
    } catch (err) {
      logger.error('Something went messaging the user...', err);
    }
  });
}

export default register;
