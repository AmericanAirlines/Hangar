import React from 'react';
import { Box } from '@chakra-ui/react';

export const AppContainer: React.FC = ({ children }) => (
  <Box width="100%" maxWidth="1200px" marginX="auto" paddingX={8}>
    {children}
  </Box>
);
