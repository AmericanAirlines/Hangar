// ACTION IDS
export const actionIds = {
  ignore: 'ignore',
  registerTeam: 'registerTeam',
  subscribe: 'subscribe',
  unsubscribe: 'unsubscribe',
  joinIdeaPitchRequestQueue: 'joinIdeaPitchRequestQueue',
  joinTechnicalRequestQueue: 'joinTechnicalRequestQueue',
};

// CALLBACK IDS
export const callbackIds = {
  registerTeamSubmitted: 'registerTeamSubmitted',
  joinSupportQueueSubmitted: 'joinSupportQueueSubmitted',
};

// VIEWS
// Register Team View
export const registerTeamViewConstants = {
  viewId: callbackIds.registerTeamSubmitted,
  fields: {
    teamMembers: 'teamMembers',
    teamName: 'teamName',
    tableNumber: 'tableNumber',
    projectDescription: 'projectDescription',
  },
};

// Join Support Queue View
export const joinSupportQueueConstants = {
  viewId: callbackIds.joinSupportQueueSubmitted,
  fields: {
    primaryLanguage: 'primaryLanguage',
    problemDescription: 'problemDescription',
  },
};
