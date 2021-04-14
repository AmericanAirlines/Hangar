type stringFunction = (params: Record<string, string>) => string;
export interface StringDictionary {
  /*----------------------------------*/
  // src>api>>supportRequest.ts
  supportRequestSuccess: stringFunction;
  jobChatSuccess: stringFunction;
  supportRequestComplete: stringFunction;
  supportRequestNoShow: stringFunction;
  remindUser: stringFunction;
  /*----------------------------------*/

  /*----------------------------------*/
  // src>slack>actions>registerTeam.ts
  registrationNotOpen: string;
  /*----------------------------------*/

  /*----------------------------------*/
  // src>slack>actions>supportRequest.ts
  supportRequestWhoops: string;
  supportRequestNotOpentext: string;
  supportRequestOpentitle: string;
  supportRequestOpentext: string;
  supportRequestAlreadyInLinetext: string;
  supportRequestExistingActiveRequest: string;
  supportRequestAlertModaltext: string;
  /*----------------------------------*/

  /*----------------------------------*/
  // src>slack>blocks>dashboardblocks.ts
  // src>discord>events>message>exit.ts
  headerinfo: string;
  intro: string;
  challenge: string;
  challenge2: string;
  subscribe: string;
  subscribe2: string;
  unsubscribe: string;
  unsubscribe2: string;
  ideaPitchRequest: string;
  ideaPitchRequest2: string;
  technicalRequest: string;
  technicalRequest2: string;
  jobChat: string;
  jobChat2: string;
  teamRegistration: string;
  teamRegistration2: string;
  comingSoon: string;
  /*----------------------------------*/

  /*----------------------------------*/
  // src>slack>blocks>registerTeam.ts
  registerTeamblocks: string;
  hackingWithWho: string;
  selectTeammate: string;
  nameNotFound: string;
  askName: string;
  tableDoubleCheck: string;
  exampleTableNumber: string;
  askTable: string;
  projectInfoDesc: string;
  projectDescription: string;
  registerTeam: string;
  submit: string;
  cancel: string;
  registerTeamSummary: stringFunction;
  /*----------------------------------*/

  /*----------------------------------*/
  // src>slack>blocks>openSourceFooter.ts
  openSource: stringFunction;
  /*----------------------------------*/

  /*----------------------------------*/
  // src>slack>events>appMention.ts
  appMention: string;
  /*----------------------------------*/

  /*----------------------------------*/
  // src>slack>events>messageReceived.ts
  messageReceived: string;
  /*----------------------------------*/

  /*----------------------------------*/
  // src>slack>views>registerTeamSubmitted.ts
  registerTeamNotOpen: stringFunction;
  teamSubmittedAdminNotification: stringFunction;
  teamSubmittedpostMessage: stringFunction;
  /*----------------------------------*/

  /*----------------------------------*/
  // src>discord>events>message>exit.ts
  exitFlow: string;
  /*----------------------------------*/

  /*----------------------------------*/
  // src>discord>events>message>help.ts
  prizeMessage: string;
  appInfoMessage: string;
  interactMessage: string;
  /*----------------------------------*/

  /*----------------------------------*/
  // src>discord>events>message>index.ts
  botTaggedMsg: string;
  botCantUnderstand: string;
  genericErrorMessage: string;
  helpDescript: string;
  pingDescript: string;
  ideaDescript: string;
  techDescript: string;
  jobDescript: string;
  registerDescript: string;
  exitDescript: string;
  /*----------------------------------*/

  /*----------------------------------*/
  // src>discord>events>message>registerTeam.ts
  registerNotOpen: string;
  registerTeamUserMessage: string;
  registerTeamTitle: string;
  registerTeamJudingTitle: string;
  registerTeamDescription: string;
  registerTeamExit: string;
  registerTeamExitValue: string;
  appNameMessage: string;
  appDetailMessage: string;
  appChannelMessage: string;
  teamChannel: string;
  finalTeamTitle: string;
  finalTeamDescription: string;
  teamNameTitle: string;
  teamMembersTitle: string;
  teamDescriptionTitle: string;
  teamChannelName: string;
  duplicateChannelCode: string;
  duplicateChannel: string;
  failedSavingTeamLogger: string;
  failedSavingTeam: string;
  /*----------------------------------*/

  /*----------------------------------*/
  // src>discord>events>message>request.ts
  queueNotActive: string;
  requestAlreadyOpen: string;
  warningSomethingWrong: string;
  supportRequestErr: string;
  addedToQueue: string;
  beforeAddToQueue: stringFunction;
  jobChatResponse: string;
  /*----------------------------------*/
}
