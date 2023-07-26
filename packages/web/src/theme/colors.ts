type Colors = Record<string, string>;

const brandPrimary = '#33658A';
const brandPrimaryLight = '#86BBD8';
const brandPrimaryDark = '#2F4858';
const brandTertiary = '#F6AE2D';
const brandCta = '#F26419';
const grayscaleLight = '#EDEEF3';
const grayscale = '#CBCDD9';

export const statusColors: Colors = {
  error: '#E53E3E',
  errorFaint: '#FF8888',
  errorDark: '#C52E2E',
  warning: '#DD6B20',
  success: '#38A169',
  alert: brandCta,
};

export const colors: Colors = {
  brandPrimary,
  brandPrimaryLight,
  brandPrimaryDark,
  brandTertiary,
  brandCta,
  grayscaleLight,
  grayscale,
  white: '#FFFFFF',
  black: '#000000',
  muted: '#868895',
  ...statusColors,
};
