import { Middleware, SlackActionMiddlewareArgs, BlockButtonAction } from '@slack/bolt';
import { app } from '..';
import { registerTeamView } from '../blocks/registerTeam';
import logger from '../../logger';
import { DmOpenResult } from '../types';
import { Config } from '../../entities/config';

// Ignore snake_case types from @slack/bolt
/* eslint-disable @typescript-eslint/camelcase, @typescript-eslint/no-explicit-any */

export const registerTeam: Middleware<SlackActionMiddlewareArgs<BlockButtonAction>> = async ({ body, ack, context }) => {
  ack();
  try {
    const teamRegistrationActive = await Config.findToggleForKey('teamRegistrationActive');
    if (!teamRegistrationActive) {
      const dm = (await app.client.conversations.open({
        token: context.botToken,
        users: body.user.id,
      })) as DmOpenResult;

      await app.client.chat.postMessage({
        token: context.botToken,
        channel: dm.channel.id,
        text: ':warning: Team registration is not open yet. Check back later once table numbers have been assigned!',
      });
      return;
    }

    await app.client.views.open({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: registerTeamView,
    });
  } catch (err) {
    logger.error('Error opening modal: ', err);
  }
};
