import Discord from 'discord.js';
import { Not } from 'typeorm';
import { SupportRequest, SupportRequestType, SupportRequestStatus } from '../../../entities/supportRequest';
import logger from '../../../logger';
import { Config } from '../../../entities/config';
import { SubCommands } from '.';
import { DiscordContext } from '../../../entities/discordContext';

/* eslint-disable no-param-reassign */

interface UserInfo {
  [k: string]: number | string | string[];
  id: string;
  requestType: SupportRequestType;
  username: string;
}

enum steps {
  inputName = 'inputName',
}

const requestTypeMapping: { [id: string]: SupportRequestType } = {
  '!technicalSupport': SupportRequestType.TechnicalSupport,
  '!ideaPitch': SupportRequestType.IdeaPitch,
  '!jobChat': SupportRequestType.JobChat,
};

export async function supportRequest(msg: Discord.Message, context: DiscordContext): Promise<void> {
  const supportRequestQueueActive = await Config.findToggleForKey('supportRequestQueueActive');
  if (!supportRequestQueueActive) {
    msg.author.send("**Whoops...**\n:see_no_evil: Our team isn't available to help at the moment, check back with us soon!");
    return;
  }

  const userHasOpenRequests =
    (await SupportRequest.createQueryBuilder()
      .where({ slackId: msg.author.id, status: Not(SupportRequestStatus.Complete) })
      .getCount()) > 0;
  if (userHasOpenRequests) {
    await msg.author.send(
      "**Whoops...**\n:warning: Looks like you're already waiting to get help from our team\nKeep an eye on your direct messages from this bot for updates. If you think this is an error, come chat with our team.",
    );
    context.clear();
    return;
  }

  const payloadInfo: UserInfo = {
    id: msg.author.id,
    requestType: requestTypeMapping[msg.content],
    username: '',
  };
  const cmdName = msg.content.replace('!', '');
  const info = payloadInfo;
  const prompt = payloadInfo.requestType === SupportRequestStatus.jobChat ? 'what\'s your name': 'what\'s the name of your team\'s voice channel?';
  msg.author.send(`Hey there :wave: before we add you to the queue, ${prompt}?`);
  context.nextStep = steps.inputName;
  context.currentCommand = cmdName;
  context.payload = info;
  await context.save();
}

export const suppSubCommands: SubCommands = {
  inputName: async (msg, ctx) => {
    const info = ctx.payload as UserInfo;
    info.username = msg.content;
    ctx.payload = info;
    const userSupportRequest = new SupportRequest(info.id, info.username, info.requestType);
    try {
      await userSupportRequest.save();
      msg.author.send(
        ":white_check_mark: You've been added to the queue! We'll send you a direct message from this bot when we're ready for you to come chat with our team.",
      );
    } catch (err) {
      await msg.author.send("**Whoops...**\n:warning: Something went wrong... come chat with our team and we'll help.");
      logger.error('Something went wrong trying to create a support request', err);
    }
    await ctx.clear();
  },
};
