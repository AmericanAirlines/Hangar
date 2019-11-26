import { App } from '@slack/bolt';
import dashboardBlocks from '../blocks/dashboardBlocks';
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
        blocks: dashboardBlocks(context),
      });
    } catch (err) {
      logger.error('Something went messaging the user...', err);
    }
  });
}

export default register;
