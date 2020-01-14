import { Subscriber } from '../../entities/subscriber';
import { Config } from '../../entities/config';

interface DashboardContext {
  [key: string]: boolean;
}

export async function getDashboardContext(userId: string): Promise<DashboardContext> {
  const teamRegistrationToggle = (await Config.findOne({ key: 'teamRegistrationActive' })) || { key: 'teamRegistrationActive', value: 'false' };
  const subscriber = await Subscriber.count({ slackId: userId, isActive: true });

  return {
    [teamRegistrationToggle.key]: teamRegistrationToggle.value === 'true',
    isSubscribed: subscriber >= 0,
  };
}
