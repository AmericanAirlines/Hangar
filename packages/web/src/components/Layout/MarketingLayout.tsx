import React from 'react';
import { Button, Link, Heading, HStack, Spacer, useTheme, VStack } from '@chakra-ui/react';
import { GiCrossFlare } from 'react-icons/gi';

export const MarketingLayout: React.FC = ({ children }) => {
  const theme = useTheme();

  return (
    <VStack alignItems="stretch" paddingTop={8} w="100%" maxW="1200px" marginX="auto">
      <HStack paddingX={4}>
        <GiCrossFlare size="36px" />
        <Heading>Project X</Heading>
        <Spacer />
        <Button as="a" href="/api/auth/github/login" size="sm" colorScheme="blue">
          Login with GitHub
        </Button>
      </HStack>
      {children}
    </VStack>
  );
};
