/* eslint-disable max-lines */
import { ThemeComponents } from '@chakra-ui/react';
import { colors, statusColors } from './colors';

export const components: ThemeComponents = {
  Accordion: {
    baseStyle: {
      container: {
        border: 'none',
      },
    },
  },
  Heading: {
    variants: {
      cta: {
        fontWeight: 'normal',
        fontFamily: 'Pacifico', // cspell:disable-line
      },
    },
  },
  Link: {
    variants: {
      cta: {
        color: colors.brandCta,
      },
    },
  },
  Button: {
    variants: {
      link: {
        color: colors.brandCta,
      },
      cta: {
        bg: colors.brandCta,
        color: colors.white,
        _hover: {
          bg: colors.brandPrimaryDark,
          color: colors.white,
          _disabled: {
            bgColor: colors.brandPrimaryLight,
            color: colors.white,
          },
        },
      },
      secondary: {
        bg: colors.brandPrimaryLight,
        color: colors.white,
        _hover: {
          bg: colors.brandPrimaryDark,
          color: colors.white,
          _disabled: {
            bgColor: colors.brandPrimaryLight,
            color: colors.white,
          },
        },
      },
      outline: {
        borderWidth: 2,
      },
      ctaOutline: {
        color: colors.brandCta,
        borderColor: colors.brandCta,
        rounded: 'md',
        borderWidth: 2,
        px: 8,
        _hover: {
          borderColor: colors.brandTertiary,
          // bgColor: colors.brandTertiary,
          color: colors.brandTertiary,
        },
      },
      danger: {
        color: statusColors.error,
        borderColor: statusColors.error,
        rounded: 'md',
        borderWidth: 2,
        px: 8,
        _hover: {
          borderColor: statusColors.errorDark,
          bgColor: statusColors.errorFaint,
          color: colors.white,
          _loading: {
            color: statusColors.errorDark,
          },
        },
      },
    },
  },
  Checkbox: {
    variants: {
      danger: {
        control: {
          borderColor: statusColors.errorFaint,
          _checked: {
            borderColor: statusColors.errorFaint,
            bgColor: statusColors.errorFaint,
            _hover: {
              borderColor: statusColors.errorDark,
              bgColor: statusColors.errorDark,
            },
          },
        },
      },
    },
    baseStyle: {
      control: {
        borderColor: colors.brandPrimary,
        _checked: {
          borderColor: colors.brandPrimary,
          bgColor: colors.brandPrimary,
          _hover: {
            borderColor: colors.brandPrimary,
            bgColor: colors.brandPrimaryDark,
          },
        },
      },
    },
  },
  Radio: {
    baseStyle: {
      control: {
        borderColor: colors.brandPrimary,
        _checked: {
          borderColor: colors.brandPrimary,
          bgColor: colors.brandPrimary,
          _hover: {
            borderColor: colors.brandPrimary,
            bgColor: colors.brandPrimaryDark,
          },
        },
      },
    },
  },
  Code: {
    variants: {
      subtle: {
        bgColor: colors.grayscale,
        color: colors.black,
      },
    },
    defaultProps: {
      background: colors.grayscale,
      bgColor: colors.grayscale,
      color: colors.black,
    },
  },
  Input: {
    baseStyle: {
      borderColor: colors.black,
      borderBottomColor: colors.black,
    },
    variants: {
      flushed: {
        field: {
          borderBottomWidth: 2,
        },
      },
    },
    defaultProps: {
      variant: 'flushed',
      focusBorderColor: colors.brandPrimary,
    },
  },
  Progress: {
    baseStyle: {
      filledTrack: {
        bgColor: colors.brandPrimary,
      },
    },
  },
  Switch: {
    baseStyle: {
      track: {
        _checked: {
          bg: colors.brandPrimary,
        },
      },
    },
  },
  Textarea: {
    variants: {
      outline: {
        _focusVisible: {
          borderColor: colors.brandPrimary,
        },
      },
    },
  },
  Tabs: {
    baseStyle: {
      tablist: {
        color: colors.muted,
      },
      tab: {
        _selected: {
          borderColor: colors.brandPrimary,
          color: colors.brandPrimary,
          fontWeight: 700,
        },
      },
    },
  },
  List: {
    variants: {
      card: {
        item: {
          position: 'relative',
          padding: 6,
          listStyleType: 'none',
          border: 1,
          borderStyle: 'solid',
          borderRadius: '8px',
        },
      },
    },
  },
  Tag: {
    baseStyle: {
      container: {
        background: colors.brandPrimary,
      },
    },
    variants: {
      success: {
        container: {
          background: colors.success,
          color: colors.black,
        },
      },
    },
  },
};
