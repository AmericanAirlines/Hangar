import React from 'react';
import {
  HStack,
  Spacer,
  Link,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { CgMenuCheese } from 'react-icons/cg';
import { NavLink } from './NavLink';
import { Logo } from './Logo';

export const NavBar: React.FC = () => (
  <HStack as="nav" spacing={8} paddingTop={[4, 4, 4, 0]}>
    <Logo width="70px" />
    <HStack spacing={8} flex={1} display={['none', 'none', 'none', 'flex']}>
      <HStack spacing={0}>
        <NavLink label="Home" href="/app" />
        <NavLink label="Get Help" href="/app/help" />
        <Link as="a" variant="nav" href="https://jobs.aa.com" target="_blank">
          Work at American
        </Link>
      </HStack>
      <Spacer />
      <NavLink label="Logout" href="/auth/logout" />
    </HStack>
    <HStack
      spacing={8}
      flex={1}
      display={['flex', 'flex', 'flex', 'none']}
      justifyContent="flex-end"
    >
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          fontSize={28}
          icon={<CgMenuCheese />}
          variant="link"
        />
        <MenuList>
          <MenuItem>
            <NavLink label="Home" href="/app" />
          </MenuItem>
          <MenuItem>
            <NavLink label="Get Help" href="/app/help" />
          </MenuItem>
          <MenuItem>
            <Link as="a" variant="nav" href="https://jobs.aa.com" target="_blank">
              Work at American
            </Link>
          </MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  </HStack>
);
