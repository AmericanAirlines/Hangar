import { Request, Response } from 'express';
import { Config } from '@hangar/shared';
import { env } from '../../env';
import { formatSlackRedirectUri } from '../../slack/formatSlackRedirectUri';

const slackAuthBaseUrl: string =
  'https://slack.com/openid/connect/authorize?scope=openid%20email%20profile&response_type=code&';

export const get = async (req: Request, res: Response) => {
  const { [Config.global.authReturnUriParamName]: returnTo } = req.query as Record<string, string>;

  const queryArgs = new URLSearchParams({
    redirect_uri: formatSlackRedirectUri({ returnTo }),
    client_id: env.slackClientID,
  }).toString();

  res.redirect(`${slackAuthBaseUrl}${queryArgs}`);
};
