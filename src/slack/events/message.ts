import { App } from '@slack/bolt';
import dashboardBlocks from '../blocks/dashboardBlocks';

function register(bolt: App): void {
  bolt.message(({ say }) => {
    // TODO: Use RTM to open a socket? How else will we accept resumes?
    say({
      text: '',
      blocks: dashboardBlocks,
    });
  });
}

export default register;
