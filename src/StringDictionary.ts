/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable quotes */
import { SupportRequestType } from './types/supportRequest';
import { StringDictionary } from './IStringDictionary';
import { env } from './env';

export const stringDictionary = {} as StringDictionary;

/*----------------------------------*/
// src>api>>supportRequest.ts
stringDictionary.supportRequestSuccess = (params) =>
  `:tada: ${params.supportName} is ready to ${
    params.type === SupportRequestType.IdeaPitch ? 'help you with an idea' : 'help with your technical issue'
  }, they should join the \`${params.name}\` voice channel soon!`;

stringDictionary.jobChatSuccess = (params) =>
  `:tada: We're almost ready for you! Please join our Zoom waiting room and ${params.supportName} will admit you when they are ready! (There may be a brief wait before we admit you)\n\n**JOIN NOW: **${env.jobChatUrl}`;

stringDictionary.supportRequestComplete = (params) =>
  `${
    params.type === SupportRequestType.JobChat ? 'We hope you enjoy chatting with our team!' : 'Thanks for chatting with our team!'
  } If you want to chat with us again, just rejoin one of our support queues :smile:`;

stringDictionary.supportRequestNoShow = (params) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  `:exclamation: We messaged you about your support request ${params.relativeTimeElapsedString}, but it seems we weren't able to connect with you. Your request has been closed, but if you'd still like to meet with our team, please rejoin the queue!`;

stringDictionary.remindUser = (params) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  `:exclamation: We messaged you about your support request ${params.relativeTimeElapsedString}, but we haven't heard from you at our booth. Please head over to our booth so that we can help you with your request!`;
/*----------------------------------*/

/*----------------------------------*/
// src>slack>actions>registerTeam.ts
stringDictionary.registrationNotOpen = `:warning: Team registration is not open yet. Check back later or, if you're subscribed to updates, watch for a direct message from the bot!`;
/*----------------------------------*/

/*----------------------------------*/
// src>slack>actions>supportRequest.ts
stringDictionary.supportRequestWhoops = `Whoops...`;

stringDictionary.supportRequestNotOpentext = `:see_no_evil: Our team isn't available to help at the moment, check back with us soon!`;

stringDictionary.supportRequestOpentitle = `You're All Set`;

stringDictionary.supportRequestOpentext = `:white_check_mark: You've been added to the queue! We'll send you a direct message from this bot when we're ready for you to come chat with our team.`;

stringDictionary.supportRequestAlreadyInLinetext = `:warning: Looks like you're already waiting to get help from our team`;

stringDictionary.supportRequestExistingActiveRequest = `Keep an eye on your direct messages from this bot for updates. If you think this is an error, come chat with our team.`;

stringDictionary.supportRequestAlertModaltext = `:warning: Something went wrong... come chat with our team and we'll help.`;
/*----------------------------------*/

/*----------------------------------*/
// src>slack>blocks>dashboardblocks.ts
// src>discord>events>message>exit.ts
stringDictionary.headerinfo = `Hello, Welcome to Hangar :wave:`;

stringDictionary.intro = `Hey there! :wave: I'm a bot designed to provide you with resources for the hackathon!`;

stringDictionary.challenge = `*Sponsor Challenge*
Want to read up on our challenge and see what our prizes are?`;

stringDictionary.challenge2 = `Challenge Info`;

stringDictionary.subscribe = `*Subscribe to Updates*
Want to stay informed throughout the event? Subscribe and we'll send you occasional updates here in Slack (_you can unsubscribe at any time_).`;

stringDictionary.subscribe2 = `Subscribe`;

stringDictionary.unsubscribe = `*Unsubscribe from Updates*
Want us to stop sending you messages about the event? Don't worry, we can still be friends.`;

stringDictionary.unsubscribe2 = `Unsubscribe`;

stringDictionary.ideaPitchRequest = `*Need idea help?*
Come pitch your idea to us and get feedback, you might even get some bonus points towards your final score! No idea what to build? Let's chat!`;

stringDictionary.ideaPitchRequest2 = `Join Idea Pitch Queue`;

stringDictionary.technicalRequest = `*Need technical help?*
Having trouble with your app? Our team is here to help!`;

stringDictionary.technicalRequest2 = `Join Tech Support Queue`;

stringDictionary.teamRegistration = `*Register Your Team*
Hacking with us this weekend? Make sure to register your team so we know to reach out before judging starts!`;

stringDictionary.teamRegistration2 = `Register Team`;

stringDictionary.comingSoon = `404 - Useful Content Not Found
But seriously, I don't have anything else to show you at the moment. Message me again later!`;
/*----------------------------------*/

/*----------------------------------*/
// src>slack>blocks>registerTeam.ts
stringDictionary.registerTeamblocks = `*Register your team for judging* :mag:
\nOnly one person from each team should register`;

stringDictionary.hackingWithWho = `Who are you hacking with?`;

stringDictionary.selectTeammate = `Select teammates`;

stringDictionary.nameNotFound = `404 - Name not found`;

stringDictionary.askName = `What's your team/app name?`;

stringDictionary.tableDoubleCheck = `Make sure your table number is correct or we won't be able to find you!`;

stringDictionary.exampleTableNumber = `e.g., 42`;

stringDictionary.askTable = `What's your table number?`;

stringDictionary.projectInfoDesc = `What does your project do? How will make a difference? What technologies are used?`;

stringDictionary.projectDescription = `What does your project do?`;

stringDictionary.registerTeam = `Register Team`;

stringDictionary.submit = `Submit`;

stringDictionary.cancel = `Cancel`;

stringDictionary.registerTeamSummary = (
  params,
) => `${params.userString} registered your team for sponsor judging. Our team will stop by during judging to see your hack. Best of luck and see you soon!

*Team Name*: ${params.teamName}
*Table Number*: ${params.tableNumber}
*Project Description*: ${params.projectDescription}`;
/*----------------------------------*/

/*----------------------------------*/
// src>slack>blocks>joinSupportQueue.ts
stringDictionary.joinSupportQueueblocks = `*Join our Tech Support Queue* :mag:
\nOnly one person from each team should join`;

stringDictionary.askPrimaryLanguage = `What's the primary language you're working with?`;

stringDictionary.primaryLanguage = `Primary Language`;

stringDictionary.problemDescription = `What can we help you with?`;

stringDictionary.problemInfoDesc = `Provide a brief summary of the issue you're having`;

stringDictionary.joinSupportQueueSummary = (params) => `You have been added to the tech support queue! Here is the informaion you provided us:

*Primary Language*: ${params.primaryLanguage}
*Problem Description*: ${params.problemDescription}`;
/*----------------------------------*/

/*----------------------------------*/
// src>slack>blocks>openSourceFooter.ts
stringDictionary.openSource = (params) => `<${params.repoUrl} | _*Hangar*_> is an Open Source project created by American Airlines.`;
/*----------------------------------*/

/*----------------------------------*/
// src>slack>events>appMention.ts
stringDictionary.appMention = `Hey there! :wave: I can help your team during the hackathon! To see all of the things I can help with, simply click/tap my name and choose 'Go to App' :tada:`;
/*----------------------------------*/

/*----------------------------------*/
// src>slack>events>messageReceived.ts
stringDictionary.messageReceived = `Hey there! :wave: I'm a bot designed to provide you with resources for the hackathon! Most of my functionality can be accessed via the Home Tab above. To get started, just click/tap 'Home' at the top of your screen.
\nOccasionally I'll send you updates here as well, so keep an eye out for unread messages in your sidebar.`;
/*----------------------------------*/

/*----------------------------------*/
// src>slack>views>registerTeamSubmitted.ts
stringDictionary.registerTeamNotOpen = (
  params,
) => `:warning: Team registration isn't currently open, please try again later or come chat with our team if you think this is an error.
Team Name: ${params.teamName}
TableNumber: ${params.tableNumber}
Project Description: ${params.projectDescription}
Team Members: ${params.formattedTeamMembers}`;

stringDictionary.teamSubmittedAdminNotification = (params) => `<@${params.registeringUser}> registered their team for judging:
Team Members: ${params.formattedTeamMembers}
Table Number: ${params.tableNumber}`;

stringDictionary.teamSubmittedpostMessage = (
  params,
) => `:warning: Something went wrong while registering your team... come chat with our team for help.
To help with resubmitting, here's the info you tried to submit:
Team Name: ${params.teamName}
TableNumber: ${params.tableNumber}
Project Description: ${params.projectDescription}
Team Members: ${params.formattedTeamMembers}
Here's what went wrong, it may be helpful (but probably not):
\`\`\`
${JSON.stringify(params.err, null, 2)}
\`\`\`
`;
/*----------------------------------*/

/*----------------------------------*/
// src>slack>views>joinSupportQueueSubmitted.ts
stringDictionary.joinSupportQueueNotOpen = (
  params,
) => `:warning: Tech Help Queue isn't currently open, please try again later or come chat with our team if you think this is an error.
Primary Language: ${params.primaryLanguage}
Problem Description: ${params.problemDescription}`;

stringDictionary.joinedSupportQueueAdminNotification = (params) => `<@${params.registeringUser}> joined the tech help queue:
Primary Langauge: ${params.primaryLanguage}
Problem Description: ${params.problemDescription}`;

stringDictionary.joinedSupportQueuepostMessage = (
  params,
) => `:warning: Something went wrong while adding you to the tech help queue... come chat with our team for help.
To help with resubmitting, here's the info you tried to submit:
Primary Language: ${params.primaryLanguage}
Problem Description: ${params.problemDescription}
Here's what went wrong, it may be helpful (but probably not):
\`\`\`
${JSON.stringify(params.err, null, 2)}
\`\`\`
`;
/*----------------------------------*/

/*----------------------------------*/
// src>discord>events>message>exit.ts
stringDictionary.exitFlow = `You have been successfully exited out of any flows you were in!`;
/*----------------------------------*/

/*----------------------------------*/
// src>discord>events>message>help.ts
stringDictionary.prizeMessage = `**PRIZES** - Think your team has what it takes to win?\nCheck out our :sparkles:[**CHALLENGE AND PRIZES**](${env.challengeUrl}):sparkles:\n\n**SWAG** 
- Want a free American Hacker shirt? Make sure to come chat with us about jobs, your idea, or get technical help using the options below!\n\n**BONUS PRIZES** 
- Hacking on our challenge? Use \`!registerTeam\` below and you’ll be entered into a raffle to win prizes for your whole team!\n\n\n
Listed below are various commands that you can use to interact with the bot!`;
stringDictionary.appInfoMessage = `[Hangar](https://github.com/AmericanAirlines/Hangar) is an Open Source project created by American Airlines.`;
stringDictionary.interactMessage = `Hey there! :wave:\nCheck your DMs for information on how to interact with me!`;
/*----------------------------------*/

/*----------------------------------*/
// src>discord>events>message>index.ts
stringDictionary.botTaggedMsg =
  'Hi there! :wave: I can only help from within a Direct Message. Click my name and send the message `!help` to get started!';
stringDictionary.botCantUnderstand = "That isn't a command I understand. Try replying with `!help` to see the full list of things I can help with!";
stringDictionary.helpDescript = 'Lists commands the user can use to interact with the bot';
stringDictionary.pingDescript = 'Replies with pong';
stringDictionary.ideaDescript = 'Think you have a good idea? Join a queue to come pitch to our team!';
stringDictionary.techDescript = 'Need help with your hack? Join our tech support queue so our team can help!';
stringDictionary.jobDescript = 'Interested in joining our team? Come chat with us about Full Time and Internship opportunities!';
stringDictionary.registerDescript = 'Let us know who you’re hacking with and what you’re hacking on! There may even be prizes involved :wink:';
stringDictionary.exitDescript = 'Exits the user out of any flows they might be in (such as team registration)';
/*----------------------------------*/

/*----------------------------------*/
// src>discord>events>message>registerTeam.ts
stringDictionary.registerNotOpen = `:warning: Team registration is not open yet. Please check back later or wait for announcements!`;
stringDictionary.registerTeamUserMessage = `Who are you hacking with? If you are hacking alone, simply write your name!\n**Be sure to input your name as well as your teammate's names in a comma-separated list (e.g. John Smith, Jane Doe, ...)!**`;
stringDictionary.registerTeamTitle = `registerTeam`;
stringDictionary.registerTeamJudingTitle = `*Register your team for judging* :mag:\n:warning: Only one person from each team should register`;
stringDictionary.registerTeamDescription = `Answer each question the bot provides. Once you are done answering a question, DM the answer to the bot and it will reply prompting for the next answer!`;
stringDictionary.registerTeamExit = `Exiting the flow`;
stringDictionary.registerTeamExitValue = 'If you would like to exit the signup process at any time, either type `!exit` or any other command!';
stringDictionary.appNameMessage = `What's your team or app name?`;
stringDictionary.appDetailMessage = `What does your project do? How will it make a difference? What technologies are used?`;
stringDictionary.appChannelMessage = `What's your team's channel name? (e.g. Hacker Room 51)`;
stringDictionary.teamChannel = `teamChannel`;
stringDictionary.finalTeamTitle = `**You are signed up :partying_face:**`;
stringDictionary.finalTeamDescription = `Here are the details for your team:`;
stringDictionary.teamNameTitle = `Team Name:`;
stringDictionary.teamMembersTitle = `Team Members:`;
stringDictionary.teamDescriptionTitle = `Team Description:`;
stringDictionary.teamChannelName = `Team Channel Name`;
stringDictionary.duplicateChannelCode = `23505`;
stringDictionary.duplicateChannel = `Oops, looks like someone already entered the channel name that you input! Please try again`;
stringDictionary.failedSavingTeamLogger = `Saving team failed: `;
stringDictionary.failedSavingTeam = `Oops, looks like something went wrong on our end! Come to our booth and we will try to sort things out.`;
/*----------------------------------*/

/*----------------------------------*/
// src>discord>events>message>index.ts
stringDictionary.queueNotActive = "**Whoops...**\n:see_no_evil: Our team isn't available to help at the moment, check back with us soon!";
stringDictionary.requestAlreadyOpen =
  "**Whoops...**\n:warning: Looks like you're already waiting to get help from our team\nKeep an eye on your direct messages from this bot for updates. If you think this is an error, come chat with our team.";
stringDictionary.warningSomethingWrong = "**Whoops...**\n:warning: Something went wrong... come chat with our team and we'll help.";
stringDictionary.supportRequestErr = 'Something went wrong trying to create a support request';
stringDictionary.addedToQueue =
  ":white_check_mark: You've been added to the queue! We'll send you a direct message from this bot when we're ready for you to come chat with our team.";
stringDictionary.beforeAddToQueue = (params) => `Hey there! :wave: Before we add you to the queue, ${params.prompt}?`;
stringDictionary.jobChatResponse = '\n\nPlease make sure to have your resume ready for our team!';
/*----------------------------------*/
