type Colors = Record<string, string>;

const brandPrimary = '#00467F';
const brandPrimaryLight = '#0078D2';
const brandPrimaryDark = '#36495A';
const brandTertiary = '#FAAF00';
const brandCta = '#FF7318';
const grayscaleLight = '#D0DAE0';
const grayscale = '#9DA6AB';

export const statusColors: Colors = {
  error: '#E53E3E', // not in brand
  errorFaint: '#FF8888', // not in brand
  errorDark: '#C30019',
  warning: '#FAAF00',
  success: '#00B989',
  alert: brandCta,
} as const;

export const colors: Colors = {
  brandPrimary,
  brandPrimaryLight,
  brandPrimaryDark,
  brandTertiary,
  brandCta,
  grayscaleLight,
  grayscale,
  white: '#FFFFFF',
  black: '#131313',
  muted: '#7B8085',
  ...statusColors,
} as const;
