import { App } from '@slack/bolt';
import dashboardBlocks from '../blocks/dashboardBlocks';
import openSourceBlock from '../blocks/openSourceFooter';
import { Config } from '../../entities/config';
import logger from '../../logger';

function register(bolt: App): void {
  bolt.message(async ({ say }) => {
    // TODO: get context (toggles), use to generate specific dashboard blocks
    const teamRegistrationActiveKey = 'teamRegistrationActive';
    const teamRegistrationActive = await Config.findToggleForKey(teamRegistrationActiveKey);
    const context = {
      teamRegistrationActiveKey: teamRegistrationActive,
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
