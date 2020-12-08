export enum SupportedPlatform {
  slack = 'slack',
  discord = 'discord',
}

export const getActivePlatform = (): SupportedPlatform => {
  if (Object.keys(SupportedPlatform).includes(process.env.PLATFORM_USED)) {
    return (SupportedPlatform as Record<string, string>)[process.env.PLATFORM_USED] as SupportedPlatform;
  }

  throw new Error(`Unknown platform, specify PLATFORM_USED to be one of [${Object.keys(SupportedPlatform).join(', ')}]`);
};
