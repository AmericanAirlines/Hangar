import React from 'react';
import { HStack, Spacer, useColorModeValue } from '@chakra-ui/react';
import { NavLink } from './NavLink';
import { NavProfileMenu } from './NavProfileMenu';

export const NavBar: React.FC = () => (
  <HStack bg={useColorModeValue('gray.100', 'gray.900')}>
    <NavLink label="Home" href="/app" />
    <NavLink label="Community" href="" />
    <NavLink label="Videos" href="/app/videos" />
    <Spacer />
    <NavProfileMenu />
  </HStack>
);
