import React from 'react';
import { HStack, Spacer, Link } from '@chakra-ui/react';
import { NavLink } from './NavLink';
import { Logo } from './Logo';

export const NavBar: React.FC = () => (
  <HStack as="nav" spacing={8}>
    <Logo width="70px" />
    <HStack spacing={0}>
      <NavLink label="My Project" href="/app" />
      <NavLink label="Get Help" href="" />
      <Link as="a" variant="nav" href="https://jobs.aa.com" target="_blank">
        Work at American
      </Link>
    </HStack>
    <Spacer />
    <NavLink label="Logout" href="/auth/logout" />
  </HStack>
);
