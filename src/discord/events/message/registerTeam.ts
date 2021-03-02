import Discord from 'discord.js';
import { colors } from '../../constants';
import { Team } from '../../../entities/team';
import { Config } from '../../../entities/config';
import { DiscordContext } from '../../../entities/discordContext';
import { SubCommands } from '.';
import { stringDictionary } from '../../../StringDictionary';
import logger from '../../../logger';

/* eslint-disable no-param-reassign */

enum RegistrationSteps {
  teamMembers = 'teamMembers',
  teamName = 'teamName',
  teamDescription = 'teamDescription',
  teamChannel = 'teamChannel',
}

interface PartialTeamInfo {
  [k: string]: number | string | string[];
  members?: string[];
  name?: string;
  description?: string;
  channel?: string;
}

export async function registerTeam(msg: Discord.Message, context: DiscordContext): Promise<void> {
  const teamRegistrationActive = await Config.findToggleForKey('teamRegistrationActive');
  if (!teamRegistrationActive) {
    await msg.author.send(stringDictionary.registerNotOpen);
    return;
  }
  await msg.author.send({
    embed: {
      color: colors.info,
      title: stringDictionary.registerTeamJudingTitle,
      description: stringDictionary.registerTeamDescription,
      fields: [
        {
          name: stringDictionary.registerTeamExit,
          value: stringDictionary.registerTeamExitValue,
        },
      ],
    },
  });
  context.nextStep = RegistrationSteps.teamMembers;
  context.currentCommand = stringDictionary.registerTeamTitle;
  await context.save();
  await msg.author.send(stringDictionary.registerTeamUserMessage);
}

export const regSubCommands: SubCommands = {
  teamMembers: async (msg, ctx) => {
    ctx.nextStep = RegistrationSteps.teamName;
    const team: PartialTeamInfo = {
      members: [],
    };
    const temp = msg.content.split(',');

    for (let i = 0; i < temp.length; i += 1) {
      temp[i] = temp[i].trim();
      team.members.push(temp[i]);
    }
    ctx.payload = team;
    ctx.currentCommand = stringDictionary.registerTeamTitle;
    await ctx.save();
    msg.author.send(stringDictionary.AppNameMessage);
  },
  teamName: async (msg, ctx) => {
    ctx.nextStep = RegistrationSteps.teamDescription;
    const team = ctx.payload as PartialTeamInfo;
    team.name = msg.content;
    ctx.payload = team;
    ctx.currentCommand = stringDictionary.registerTeamTitle;
    await ctx.save();
    await msg.author.send(stringDictionary.AppDetailMessage);
  },
  teamDescription: async (msg, ctx) => {
    ctx.nextStep = RegistrationSteps.teamChannel;
    const team = ctx.payload as PartialTeamInfo;
    team.description = msg.content;
    ctx.payload = team;
    ctx.currentCommand = stringDictionary.registerTeamTitle;
    await ctx.save();
    await msg.author.send(stringDictionary.AppChannelMessage);
  },
  teamChannel: async (msg, ctx) => {
    const team = ctx.payload as PartialTeamInfo;
    ctx.currentCommand = stringDictionary.registerTeamTitle;
    ctx.nextStep = stringDictionary.teamChannel;
    team.channel = msg.content;
    ctx.payload = team;
    await ctx.save();
    const finalTeam = new Team(team.name, null, team.description, team.members, team.channel);
    try {
      await finalTeam.save();
      await msg.author.send({
        embed: {
          color: colors.info,
          title: stringDictionary.finalTeamTitle,
          description: stringDictionary.finalTeamDescription,
          fields: [
            {
              name: stringDictionary.TeamNameTitle,
              value: (await finalTeam).name,
            },
            {
              name: stringDictionary.TeamMembersTitle,
              value: (await finalTeam).members,
            },
            {
              name: stringDictionary.TeamDescriptionTitle,
              value: (await finalTeam).projectDescription,
            },
            {
              name: stringDictionary.TeamChannelName,
              value: (await finalTeam).channelName,
            },
          ],
        },
      });
      await ctx.clear();
    } catch (err) {
      // Check if duplicate key constraint error (Postgres error 23505 - unique_violation)
      if (err.code === stringDictionary.DuplicateChannelCode) {
        await msg.author.send(stringDictionary.DuplicateChannel);
      } else {
        logger.error(stringDictionary.FailedSavingTeamLogger, err);
        await msg.author.send(stringDictionary.FailedSavingTeam);
      }
    }
  },
};
