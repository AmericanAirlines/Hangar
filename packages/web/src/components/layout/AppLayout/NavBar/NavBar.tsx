/* eslint-disable max-lines */
import React from 'react';
import {
  HStack,
  Spacer,
  IconButton,
  useDisclosure,
  Fade,
  Flex,
  useBreakpointValue,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { NavDrawer } from './NavDrawer';
import { useUserStore } from '../../../../stores/user';
import { Login } from './NavElements/AuthButtons/Login';
import { SignUp } from './NavElements/AuthButtons/SignUp';
import { Schedule } from './NavElements/PageLinks/Schedule';
import { NavLogo } from './NavLogo';
import { JoinSlackButton } from '../../../JoinSlackButton';

export const NavBar: React.FC = () => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { user, doneLoading } = useUserStore();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      <HStack width="full">
        <IconButton aria-label="Navigation Menu" icon={<HamburgerIcon />} onClick={onOpen} />

        <NavLogo />

        <Fade in={doneLoading}>
          <Flex gap={5} alignItems="center">
            {/* PAGE LINKS – NON-MOBILE ONLY */}
            {!isMobile && (
              <>
                <Schedule />
                <JoinSlackButton />
              </>
            )}

            {/* AUTH BUTTONS */}
            {!user && (
              <>
                <SignUp mentionLogin={isMobile} />
                {!isMobile && <Login />}
              </>
            )}
          </Flex>
        </Fade>
      </HStack>
      <Spacer />
      <NavDrawer isOpen={isOpen} onClose={onClose} />
    </>
  );
};
