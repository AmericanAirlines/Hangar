import { App } from '@slack/bolt';
import { appHomeOpened } from './appHomeOpened';

export const events: (bolt: App) => void = (bolt) => {
  bolt.event('app_home_opened', appHomeOpened);
};
