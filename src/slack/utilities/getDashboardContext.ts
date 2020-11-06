import { Config } from '../../entities/config';

interface DashboardContext {
  [key: string]: boolean;
}

export async function getDashboardContext(): Promise<DashboardContext> {
  const teamRegistrationToggle = (await Config.findOne({ key: 'teamRegistrationActive' })) || { key: 'teamRegistrationActive', value: 'false' };
  const isSubscribed = false;

  return {
    isSubscribed,
    [teamRegistrationToggle.key]: teamRegistrationToggle.value === 'true',
  };
}
