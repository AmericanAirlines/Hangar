import { App } from '@slack/bolt';
import dashboardBlocks from '../blocks/dashboardBlocks';
import { Config } from '../../entities/config';
import logger from '../../logger';
import openSourceBlock from '../blocks/openSourceFooter';

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
        blocks: [...dashboardBlocks(context), openSourceBlock],
      });
    } catch (err) {
      logger.error('Something went wrong messaging the user...', err);
    }
  });
}

export default register;
