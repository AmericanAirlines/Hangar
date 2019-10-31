import { App } from '@slack/bolt';
import dashboardBlocks from '../blocks/dashboardBlocks';

function register(bolt: App): void {
  bolt.message(({ say }) => {
    // TODO: get context (toggles), use to generate specific dashboard blocks
    say({
      text: '',
      blocks: dashboardBlocks,
    });
  });
}

export default register;
