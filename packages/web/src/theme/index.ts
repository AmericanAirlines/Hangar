import { extendTheme, ThemeConfig, ThemeOverride } from '@chakra-ui/react';
import { colors } from './colors';
import { components } from './components';

// https://chakra-ui.com/docs/styled-system/color-mode
export const forcedColorMode = 'light';
const config: ThemeConfig = {
  initialColorMode: forcedColorMode,
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  colors,
  components,
  fonts: {
    // heading: 'Inter',
    // body: 'Inter',
  },
  styles: {
    global: () => ({
      '*': {
        borderColor: 'gray.300',
        '::-webkit-scrollbar': { display: 'none' },
      },
      heading: {
        // fontFamily: 'Inter',
        // fontWeight: 400, // When adding additional weights, make sure to add the import to _app.tsx
      },
      body: {
        color: colors.black,
        backgroundColor: colors.grayscaleLight,
      },
    }),
  },
} as ThemeOverride);

export * from './colors';
