/* istanbul ignore file */
import React from 'react';
import {
  Heading,
  VStack,
  useColorModeValue,
  Box,
  Stack,
  Alert,
  AlertDescription,
  AlertIcon,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import { AppLayout } from '../../components/Layout';
import { AppContainer } from '../../components/AppContainer/AppContainer';

const AppHome: NextPage = () => (
  <AppLayout>
    <Box backgroundColor={useColorModeValue('gray.200', 'gray.900')}>
      <AppContainer>
        <Stack
          direction={['column', 'column', 'column', 'row']}
          paddingY={12}
          spacing={16}
          alignItems="flex-start"
        >
          <VStack flex={1} alignItems="flex-start" spacing={4}>
            <Heading>Almost Done</Heading>
            <Alert rounded="2xl">
              <AlertIcon />
              <AlertDescription>
                We&apos;re putting finishing touches on our help queue, in the meantime come by our
                booth and we&apos;ll help you out! We can help with anything tech related, and if
                you have questions about your idea for our challenge we can help with that too!
              </AlertDescription>
            </Alert>
          </VStack>
        </Stack>
      </AppContainer>
    </Box>
  </AppLayout>
);

export default AppHome;
