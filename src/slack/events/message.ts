import { App } from '@slack/bolt';
import dashboardBlocks from '../blocks/dashboardBlocks';
import openSourceBlock from '../blocks/openSourceFooter';
import { Config } from '../../entities/config';
import logger from '../../logger';

function register(bolt: App): void {
  bolt.message(async ({ say, message }) => {
    // TODO: get context (toggles), use to generate specific dashboard blocks
    const teamRegistrationToggle = (await Config.findOne({ key: 'teamRegistrationActive' })) || { key: 'teamRegistrationActive', value: 'false' };
    const context = {
      [teamRegistrationToggle.key]: teamRegistrationToggle.value === 'true',
    };
    try {
      // Only respond if the message doesn't have a subtype (i.e., original user message event, deletion/edits are ignored)
      if (!message.subtype) {
        say({
          text: '',
          blocks: dashboardBlocks(context),
        });
      }
    } catch (err) {
      logger.error('Something went wrong messaging the user...', err);
    }
  });
}

export default register;
