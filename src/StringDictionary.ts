/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable quotes */
import { SupportRequestType } from './entities/supportRequest';
import { StringDictionary } from './IStringDictionary';

export const stringDictionary = {} as StringDictionary;

/*----------------------------------*/
// src>api>>supportRequest.ts
stringDictionary.supportRequestSuccess = (params) => `:tada: ${params.supportName} is ready to ${
  params.type === SupportRequestType.IdeaPitch ? 'help you with an idea' : 'help with your technical issue'
}, so head over to our booth. Feel free to bring other members of your team and make sure to bring your laptop if relevant.
\nWhen you arrive, tell one of our team members that you're here to meet with *${params.supportName}*!`;

stringDictionary.supportRequestComplete = `Thanks for chatting with our team! If you need help again, just rejoin the idea pitch queue or the technical support queue and we'll be happy to meet with you :smile:`;

stringDictionary.supportRequestNoShow = (params) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  `:exclamation: We messaged you about your support request ${params.relativeTimeElapsedString}, but we didn't hear from you at our booth. Your request has been closed, but if you'd still like to meet with our team, please rejoin the queue!`;

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
stringDictionary.headerinfo = `Hello, Welcome to Hangar :wave:`;

stringDictionary.intro = `Hey there :wave: I'm a bot designed to provide you with resources for the hackathon!`;

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
// src>slack>blocks>openSourceFooter.ts
stringDictionary.openSource = (params) => `<${params.repoUrl} | _*Hangar*_> is an Open Source project created by American Airlines.`;
/*----------------------------------*/

/*----------------------------------*/
// src>slack>events>appMention.ts
stringDictionary.appMention = `Hey there :wave: I can help your team during the hackathon! To see all of the things I can help with, simply click/tap my name and choose 'Go to App' :tada:`;
/*----------------------------------*/

/*----------------------------------*/
// src>slack>events>messageReceived.ts
stringDictionary.messageReceived = `Hey there :wave: I'm a bot designed to provide you with resources for the hackathon! Most of my functionality can be accessed via the Home Tab above. To get started, just click/tap 'Home' at the top of your screen.
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
