import React from 'react';
import {
  Box,
  VStack,
  useColorModeValue,
  Alert,
  AlertTitle,
  AlertDescription,
  AlertIcon,
} from '@chakra-ui/react';
import { NavBar } from '../NavBar';
import { AppContainer } from '../AppContainer/AppContainer';

export const AppLayout: React.FC = ({ children }) => (
  <>
    <Alert justifyContent="center">
      <AlertIcon />
      <AlertTitle>Hey!</AlertTitle>
      <AlertDescription>
        Want to learn how to make a site like this? Come to our workshop at 3pm!
      </AlertDescription>
    </Alert>
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
