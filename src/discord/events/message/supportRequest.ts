import Discord from 'discord.js';
import { SupportRequest } from '../../../entities/supportRequest';
import { SupportRequestType, SupportRequestStatus } from '../../../types/supportRequest';
import logger from '../../../logger';
import { Config } from '../../../entities/config';
import { SubCommands } from '.';
import { DiscordContext } from '../../../entities/discordContext';

/* eslint-disable no-param-reassign */

interface PayloadInfo {
  [k: string]: number | string | string[];
  id: string;
  requestType: SupportRequestType;
  username: string;
}

enum Steps {
  inputName = 'inputName',
}

const requestTypeMapping: { [id: string]: SupportRequestType } = {
  '!technicalSupport': SupportRequestType.TechnicalSupport,
  '!ideaPitch': SupportRequestType.IdeaPitch,
  '!jobChat': SupportRequestType.JobChat,
};

export async function supportRequest(msg: Discord.Message, context: DiscordContext): Promise<void> {
  let queueActive = false;
  switch (msg.content) {
    case '!jobChat':
      queueActive = await Config.findToggleForKey('jobChatQueueActive');
      break;
    default:
      queueActive = await Config.findToggleForKey('supportRequestQueueActive');
      break;
  }
  if (!queueActive) {
    msg.author.send("**Whoops...**\n:see_no_evil: Our team isn't available to help at the moment, check back with us soon!");
    return;
  }
  const commonConditions = { slackId: msg.author.id };
  const userOpenRequestsCount = await SupportRequest.createQueryBuilder()
    .where([
      { status: SupportRequestStatus.Pending, ...commonConditions },
      { status: SupportRequestStatus.InProgress, ...commonConditions },
    ])
    .getCount();
  if (userOpenRequestsCount > 0) {
    await msg.author.send(
      "**Whoops...**\n:warning: Looks like you're already waiting to get help from our team\nKeep an eye on your direct messages from this bot for updates. If you think this is an error, come chat with our team.",
    );
    await context.clear();
    return;
  }
  const payloadInfo: PayloadInfo = {
    id: msg.author.id,
    requestType: requestTypeMapping[msg.content],
    username: '',
  };
  const cmdName = msg.content.replace('!', '');
  const info = payloadInfo;
  const prompt =
    payloadInfo.requestType === SupportRequestType.JobChat
      ? "what's your name"
      : "what's the name of your team's voice channel (e.g. Hacker Room 51)";
  msg.author.send(`Hey there! :wave: Before we add you to the queue, ${prompt}?`);
  context.nextStep = Steps.inputName;
  context.currentCommand = cmdName;
  context.payload = info;
  await context.save();
}

export const supportRequestSubCommands: SubCommands = {
  inputName: async (msg, ctx) => {
    const info = ctx.payload as PayloadInfo;
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
