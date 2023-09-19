import React from 'react';
import { Box, Tooltip } from '@chakra-ui/react';
import { colors } from '../../theme/colors';

export const Hint: React.FC<{ children: string }> = ({ children }) => (
  <Tooltip label={children} placement="right">
    <Box as="span" color={colors.grayscale} fontSize="sm" ml="2">
      ⓘ
    </Box>
  </Tooltip>
);
