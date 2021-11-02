import React from 'react';
import { Heading, HStack, VStack } from '@chakra-ui/react';
import { GiCrossFlare } from 'react-icons/gi';

export const MarketingLayout: React.FC = ({ children }) => (
  <VStack alignItems="stretch" paddingTop={8} w="100%" maxW="1200px" marginX="auto">
    <HStack paddingX={4}>
      <GiCrossFlare size="36px" />
      <Heading>Hangar</Heading>
    </HStack>
    {children}
  </VStack>
);
