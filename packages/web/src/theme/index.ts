import { extendTheme, Theme, ThemeConfig, DeepPartial } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const config: ThemeConfig = {
  useSystemColorMode: true,
};

export const theme = extendTheme({
  config,
  components: {
    Link: {
      variants: {
        navbar: {
          backgroundColor: mode('gray.100', 'gray.900'),
          px: 2,
          py: 4,
          rounded: 'md',
          _hover: {
            textDecoration: 'none',
            backgroundColor: mode('gray.200', 'gray.700'),
          },
        },
        navbarMenuItem: {
          _hover: {
            textDecoration: 'none',
          },
        },
      },
    },
    Menu: {
      parts: ['button'],
      variants: {
        navbar: {
          backgroundColor: mode('gray.100', 'gray.900'),
          _hover: {
            textDecoration: 'none',
            backgroundColor: mode('gray.200', 'gray.700'),
          },
        },
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
