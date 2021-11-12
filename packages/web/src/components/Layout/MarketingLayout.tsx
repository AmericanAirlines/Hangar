import React from 'react';
import { HStack, VStack } from '@chakra-ui/react';
import { Logo } from '../NavBar/Logo';

export const MarketingLayout: React.FC = ({ children }) => (
  <VStack alignItems="stretch" paddingTop={8} w="100%" maxW="1200px" marginX="auto">
    <HStack paddingX={4}>
      <Logo width="140px" />
    </HStack>
    {children}
  </VStack>
);
