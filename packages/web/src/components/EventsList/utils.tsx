import { colors } from '../../theme/colors';

export type EventStatus = 'IN PROGRESS' | 'PAST' | 'FUTURE';

export const addHexTransparency = (hex: string | undefined, alpha: number) => {
  const hexAlpha = Math.round(alpha * 255).toString(16);
  return hex + hexAlpha;
};

export const eventStyle = (badge: EventStatus) => ({
  color: badge === 'PAST' ? addHexTransparency(colors.grayscale, 0.5) : colors.grayscale,

  background:
    badge !== 'PAST' ? colors.brandPrimaryDark : addHexTransparency(colors.brandPrimaryDark, 0.5),

  filter: badge !== 'PAST' ? '' : 'blur(1px)',
});
