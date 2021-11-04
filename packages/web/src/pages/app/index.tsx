import React from 'react';
import { Text, Heading, HStack, VStack, useColorModeValue, Box, Button } from '@chakra-ui/react';
import { NextPage } from 'next';
import { AppLayout } from '../../components/Layout';
import { AppContainer } from '../../components/AppContainer/AppContainer';
import { Prizes } from '../../components/Prizes';

const AppHome: NextPage = () => (
  <AppLayout>
    <Box backgroundColor={useColorModeValue('gray.200', 'gray.900')}>
      <AppContainer>
        <HStack paddingY={12} alignItems="flex-start">
          <VStack flex={1} alignItems="flex-start" spacing={4}>
            <Heading>Welcome</Heading>
            <Text>Hack with American, blah, blah, blah. Registration is necessary!</Text>
            <HStack spacing={4}>
              <Button>Pre-Register</Button>
              <Button variant="ghost">Remind Me</Button>
            </HStack>
          </VStack>
          <VStack width="300px" alignItems="flex-start">
            <Heading as="h2" size="md">
              Prizes
            </Heading>
            <Prizes prizes={[]} />
          </VStack>
        </HStack>
      </AppContainer>
    </Box>
  </AppLayout>
);

export default AppHome;
