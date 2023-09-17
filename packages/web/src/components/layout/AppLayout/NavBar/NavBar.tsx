/* eslint-disable max-lines */
import React from 'react';
import {
  Box,
  HStack,
  Heading,
  Image,
  Spacer,
  Text,
  Button,
  IconButton,
  useDisclosure,
  Fade,
  Link,
  Flex,
  useBreakpointValue,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { Config } from '@hangar/shared';
import { colors } from '../../../../theme';
import { NavDrawer } from './NavDrawer';
import { useUserStore } from '../../../../stores/user';

const LOGO_HEIGHT = { base: '24px', sm: '28px', md: '40px' };
const LOGO_FONT_SIZE = { base: '22px', md: '33px' };

export async function signInWithSlack() {
  window.location.href = '/api/auth/';
}

export const NavBar: React.FC = () => {
  const router = useRouter();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { user, doneLoading } = useUserStore();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      <HStack width="full">
        <IconButton
          aria-label="Navigation Menu"
          colorScheme="whiteAlpha"
          icon={<HamburgerIcon />}
          hidden={!isMobile}
          onClick={onOpen}
          mr={3}
        />

        <Box
          onClick={() => {
            void router.push('/');
          }}
          cursor="pointer"
          width="full"
        >
          <Box py={3} lineHeight={LOGO_HEIGHT} cursor="pointer" mb={2}>
            <Image
              alt="logo"
              src={'/Logo.svg'}
              height={LOGO_HEIGHT}
              fallback={<Heading variant={'cta'}>{Config.global.appName}</Heading>}
            />
            <Text fontWeight="bold" fontSize={LOGO_FONT_SIZE}></Text>
          </Box>
        </Box>

        <Fade in={doneLoading}>
          <Flex gap={5} alignItems="center">
            {!isMobile && (
              <>
                <Link
                  onClick={() => {
                    void router.push('/schedule');
                  }}
                >
                  Schedule
                </Link>
                <Link
                  onClick={() => {
                    void router.push('/admin/dashboard');
                  }}
                >
                  Admin Dashboard
                </Link>
              </>
            )}

            {user?.firstName ? (
              <>
                <Box>
                  {user.firstName} {user.lastName}
                </Box>
                <Button
                  onClick={() => {
                    window.location.href = '/api/auth/logout';
                  }}
                >
                  {`Logout`}
                </Button>
              </>
            ) : (
              <>
                <Button
                  backgroundColor={colors.success}
                  onClick={async () => {
                    await signInWithSlack();
                  }}
                >
                  {`Sign Up${isMobile ? ' or Login' : ''}`}
                </Button>

                <Button
                  onClick={async () => {
                    await signInWithSlack();
                  }}
                  hidden={isMobile}
                >
                  Login
                </Button>
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
