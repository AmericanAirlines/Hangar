import React from 'react';
import { VStack } from '@chakra-ui/react';
import { NavBar } from '../NavBar';

export const AppLayout: React.FC = ({ children }) => (
  <VStack alignItems="stretch" w="100%" maxW="1200px" marginX="auto">
    <NavBar />
    {children}
  </VStack>
);
