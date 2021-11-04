import { extendTheme, Theme, ThemeConfig, DeepPartial } from '@chakra-ui/react';
import { mode, SystemStyleFunction } from '@chakra-ui/theme-tools';

const config: ThemeConfig = {
  useSystemColorMode: true,
};

export const theme = extendTheme({
  config,
  components: {
    Link: {
      variants: {
        nav: ((props) => ({
          paddingX: 3,
          paddingY: 4,
          borderY: 'solid 2px transparent',
          _hover: {
            textDecoration: 'none',
            borderBottomColor: mode('blue.500', 'blue.500')(props),
          },
        })) as SystemStyleFunction,
      },
    },
  },
  styles: {
    global: (props) => ({
      body: {
        color: mode('blue.800', 'gray.50')(props),
        backgroundColor: mode('gray.50', 'gray.800')(props),
      },
    }),
  },
} as DeepPartial<Theme>);
