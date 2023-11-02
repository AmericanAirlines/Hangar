// NOTE: All env vars must be prefixed with `NEXT_PUBLIC_`
// NOTE: All web env vars must be present at BUILD TIME (see dockerfile)
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const slackWorkspaceName = process.env.NEXT_PUBLIC_SLACK_WORKSPACE_NAME;
const slackInviteUrl = process.env.NEXT_PUBLIC_SLACK_INVITE_URL;

export const env = {
  baseUrl,
  slackWorkspaceName,
  slackInviteUrl,
};
