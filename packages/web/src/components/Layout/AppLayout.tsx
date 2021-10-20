import React from 'react';
import { useTheme, VStack } from '@chakra-ui/react';
import { Global } from '@emotion/react';
import { NavBar } from '../NavBar';

export const AppLayout: React.FC = ({ children }) => {
  const theme = useTheme();

  return (
    <VStack alignItems="stretch" w="100%" maxW="1200px" marginX="auto">
      <NavBar />
      {children}
    </VStack>
  );
};
