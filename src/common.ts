let isSlackActive;

if (process.env.PLATFORM_USED === 'Slack') {
  isSlackActive = true;
} else {
  isSlackActive = false;
}

export enum SupportedPlatform {
  slack = 'Slack',
  discord = 'Discord',
}

export function setSlackActive(isActive: boolean): void {
  isSlackActive = isActive;
}

export const activePlatform = isSlackActive ? SupportedPlatform.slack : SupportedPlatform.discord;
