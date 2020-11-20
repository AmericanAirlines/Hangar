type stringFunction = (params: Record<string, string>) => string;
export interface StringDictionary {
  /*----------------------------------*/
  // src>api>>supportRequest.ts
  supportRequestSuccess: stringFunction;
  supportRequestComplete: string;
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
}
