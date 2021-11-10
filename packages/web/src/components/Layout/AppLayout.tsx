import React from 'react';
import { Box, VStack, useColorModeValue } from '@chakra-ui/react';
import { NavBar } from '../NavBar';
import { AppContainer } from '../AppContainer/AppContainer';

export const AppLayout: React.FC = ({ children }) => (
  <>
    <Box
      color={useColorModeValue('blue.800', 'gray.300')}
      backgroundColor={useColorModeValue('gray.200', 'gray.900')}
    >
      <AppContainer>
        <NavBar />
      </AppContainer>
    </Box>
    <VStack alignItems="stretch">{children}</VStack>
  </>
);
