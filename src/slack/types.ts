import { WebAPICallResult } from '@slack/web-api';

// Interface declaration for Slack API requests/responses
// Long term this will not be necessary; just waiting on the Slack dev team to update their types
//   in the Bolt and WebClient packages

export interface DmOpenResult extends WebAPICallResult {
  channel: {
    id: string;
  };
}

export interface ViewSubmitInputFieldState {
  type: string;
  value?: string;
  selected_users?: string[];
}

export interface ViewSubmitStateValues {
  [blockId: string]: ViewSubmitInputFieldState | undefined;
}

export interface ViewSubmitState {
  values: { [actionId: string]: ViewSubmitStateValues | undefined };
}
