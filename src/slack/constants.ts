// ACTIONS
export const registerTeamActionId = 'registerTeam';
export const ignoreActionId = 'ignore';
export const subscribeActionId = 'subscribe';
export const unsubscribeActionId = 'unsubscribe';
export const ideaPitchRequestActionId = 'joinIdeaPitchRequestQueue';
export const technicalRequestActionId = 'joinTechnicalRequestQueue';

// VIEWS
// Register Team View
export const registerTeamViewConstants = {
  viewId: 'registerTeamSubmission',
  fields: {
    teamMembers: 'teamMembers',
    teamName: 'teamName',
    tableNumber: 'tableNumber',
    projectDescription: 'projectDescription',
  },
};
