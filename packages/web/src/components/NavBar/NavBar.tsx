import React from 'react';
import { HStack, Spacer } from '@chakra-ui/react';
import { NavLink } from './NavLink';
import { Logo } from './Logo';

export const NavBar: React.FC = () => (
  <HStack as="nav" spacing={8}>
    <Logo width="70px" />
    <HStack spacing={0}>
      <NavLink label="My Project" href="/app" />
      <NavLink label="Get Help" href="" />
      <NavLink label="Work at American" href="/app/videos" />
    </HStack>
    <Spacer />
    <NavLink label="Logout" href="/auth/logout" />
  </HStack>
);
