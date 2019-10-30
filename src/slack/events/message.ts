import { App } from '@slack/bolt';
import dashboardBlocks from '../blocks/dashboardBlocks';

function register(bolt: App): void {
  bolt.message(({ say }) => {
    say({
      text: '',
      blocks: dashboardBlocks,
    });
  });
}

export default register;
