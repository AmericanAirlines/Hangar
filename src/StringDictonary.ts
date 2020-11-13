export const stringDictionary: Record<string, string> | Record<string, (params: Record<string, string>) => string> = {}

//src>api>
//stringDictionary.teamRegistrationSuccess = (params) => `You have registered your team for sponsor judging. Our team will stop by during judging to see your hack. Best of luck and see you soon!\n**Team Name**: ${params.teamName}\n**Table Number**: ${params.tableNumber}\n**Project Description**: ${params.projectDescription}`;


//src>api>>supportRequest.ts
//stringDictionary.supportRequestSuccess = (params) => ':tada: ${adminName} is ready to ${nextRequest.type === SupportRequestType.IdeaPitch ? \'help you with an idea' : 'help with your technical issue\'}, so head over to our booth. Feel free to bring other members of your team and make sure to bring your laptop if relevant.\n\nWhen you arrive, tell one of our team members that you\'re here to meet with *${adminName}*!';
stringDictionary.supportRequestComplete = 'Thanks for chatting with our team! If you need help again, just rejoin the idea pitch queue or the technical support queue and we\'ll be happy to meet with you :smile:';
//stringDictionary.supportRequestNoShow = (params) => ':exclamation: We messaged you about your support request ${relativeTimeElapsedString}, but we didn\'t hear from you at our booth. Your request has been closed, but if you\'d still like to meet with our team, please rejoin the queue!';
//stringDictionary.ideaPitchSuccess = (params) => ':tada: ${adminName} is ready to ${request.type === SupportRequestType.IdeaPitch ? \'help you with an idea' : 'help with your technical issue\'}, so head over to our booth. Feel free to bring other members of your team and make sure to bring your laptop if relevant.\n\nWhen you arrive, tell one of our team members that you\'re here to meet with *${adminName}*!';
//stringDictionary.ideaPitchNoShow= (params) => ':exclamation: We messaged you about your support request ${relativeTimeElapsedString}, but we haven\'t heard from you at our booth. Please head over to our booth so that we can help you with your request!';

//src>slack>actions>registerTeam.ts
stringDictionary.registrationNotOpen = ':warning: Team registration is not open yet. Check back later or, if you\'re subscribed to updates, watch for a direct message from the bot!';

//src>slack>actions>supportRequest.ts
stringDictionary.supportRequestNotOpentitle = 'Whoops...';
stringDictionary.supportRequestNotOpentext = ':see_no_evil: Our team isn\t available to help at the moment, check back with us soon!';
stringDictionary.supportRequestOpentitle = 'You\'re All Set';
stringDictionary.supportRequestOpentext = ':white_check_mark: You\'ve been added to the queue! We\'ll send you a direct message from this bot when we\'re ready for you to come chat with our team.';
//stringDictionary.supportRequestAdminNotification = (params) => ':white_check_mark: You\'ve been added to the queue! We\'ll send you a direct message from this bot when we\'re ready for you to come chat with our team.';
stringDictionary.supportRequestAlreadyInLinetitle = 'Whoops...';
stringDictionary.supportRequestAlreadyInLinetext = ':warning: Looks like you\'re already waiting to get help from our team';
stringDictionary.supportRequestExistingActiveRequest = 'Keep an eye on your direct messages from this bot for updates. If you think this is an error, come chat with our team.';
stringDictionary.supportRequestAlertModaltitle = 'Whoops...';
stringDictionary.supportRequestAlertModaltext = ':warning: Something went wrong... come chat with our team and we\'ll help.';


//src>slack>blocks>dashboardblocks.ts
stringDictionary.headerBlock = "Hello, Welcome to Hangar :wave:";
stringDictionary.introBlock = "Hey there :wave: I'm a bot designed to provide you with resources for the hackathon!";
stringDictionary.challengeBlock = '*Sponsor Challenge*\nWant to read up on our challenge and see what our prizes are?';
stringDictionary.challengeBlock2 = 'Challenge Info';
stringDictionary.subscribeBlock = "*Subscribe to Updates*\nWant to stay informed throughout the event? Subscribe and we'll send you occasional updates here in Slack (_you can unsubscribe at any time_).";
stringDictionary.subscribeBlock2 = 'Subscribe';
stringDictionary.unsubscribeBlock = "*Unsubscribe from Updates*\nWant us to stop sending you messages about the event? Don't worry, we can still be friends.";
stringDictionary.unsubscribeBlock2 = 'Unsubscribe';
stringDictionary.ideaPitchRequestBlock = "*Need idea help?*\nCome pitch your idea to us and get feedback, you might even get some bonus points towards your final score! No idea what to build? Let's chat!";
stringDictionary.ideaPitchRequestBlock2 = 'Join Idea Pitch Queue';
stringDictionary.technicalRequestBlock = '*Need technical help?*\nHaving trouble with your app? Our team is here to help!';
stringDictionary.technicalRequestBlock2 = 'Join Tech Support Queue';
stringDictionary.teamRegistrationBlock = '*Register Your Team*\nHacking with us this weekend? Make sure to register your team so we know to reach out before judging starts!';
stringDictionary.teamRegistrationBlock2 = 'Register Team';
stringDictionary.comingSoonBlock = `\`404 - Useful Content Not Found\`

But seriously, I don't have anything else to show you at the moment. Message me again later!`;

//src>slack>blocks>registerTeam.ts
stringDictionary.registerTeamblocks = '*Register your team for judging* :mag:\n\nOnly one person from each team should register';
stringDictionary.hackingWithWho = 'Who are you hacking with?';
stringDictionary.selectTeammate = 'Select teammates';
stringDictionary.nameNotFound = '404 - Name not found';
stringDictionary.askName = "What's your team/app name?";
stringDictionary.tableDoubleCheck = "Make sure your table number is correct or we won't be able to find you!";
stringDictionary.exampleTableNumber = 'e.g., 42';
stringDictionary.askTable = "What's your table number?";
stringDictionary.projectInfoDesc = 'What does your project do? How will make a difference? What technologies are used?';
stringDictionary.projectDescription = 'What does your project do?';
stringDictionary.registerTeam = 'Register Team';
stringDictionary.submit = 'Submit';
stringDictionary.cancel = 'Cancel';


//src>slack>blocks>openSourceFooter.ts
//stringDictionary.openSourceBlock = (repoUrl) => `<${repoUrl} | _*Hangar*_> is an Open Source project created by American Airlines.`;

//src>slack>events>appMention.ts
stringDictionary.appMention = `Hey there :wave: I can help your team during the hackathon! To see all of the things I can help with, simply click/tap my name and choose 'Go to App' :tada:`;

//src>slack>events>messageReceived.ts
stringDictionary.messageReceived = 'Hey there :wave: I\'m a bot designed to provide you with resources for the hackathon! Most of my functionality can be accessed via the Home Tab above. To get started, just click/tap `Home` at the top of your screen.\n\nOccasionally I\'ll send you updates here as well, so keep an eye out for unread messages in your sidebar.';

//src>slack>views>registerTeamSubmitted.ts
/*stringDictionary.registerTeamNotOpen = (params) => ':warning: Team registration isn\'t currently open, please try again later or come chat with our team if you think this is an error. \n
Team Name: ${teamName}\n
TableNumber: ${tableNumber}\n
Project Description: ${projectDescription}\n
Team Members: ${formattedTeamMembers.join(', ')}\n';
stringDictionary.teamSubmittedAdminNotification = '<@${registeringUser}> registered their team for judging:\nTeam Members: ${formattedTeamMembers}\nTable Number: ${tableNumber}';
stringDictionary.teamSubmittedpostMessage = (params) => ':warning: Something went wrong while registering your team... come chat with our team for help.\n
To help with resubmitting, here\'s the info you tried to submit:\n
Team Name: ${teamName}\n
TableNumber: ${tableNumber}\n
Project Description: ${projectDescription}\n
Team Members: ${formattedTeamMembers.join(', ')}\n
Here\'s what went wrong, it may be helpful (but probably not):\n
\`\`\`\n
${JSON.stringify(err, null, 2)}\n
\`\`\`
'; */
