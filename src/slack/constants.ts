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
