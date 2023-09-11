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
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { appName } from '@hangar/shared';
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
  return (
    <>
      <HStack width="full">
        <IconButton
          aria-label="Navigation Menu"
          colorScheme="whiteAlpha"
          icon={<HamburgerIcon />}
          display={{ base: 'inline', lg: 'none' }}
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
          <HStack as="a" py={3} spacing={2} lineHeight={LOGO_HEIGHT}>
            <Image
              alt="logo"
              src={'/Logo.svg'}
              height={LOGO_HEIGHT}
              fallback={<Heading variant={'cta'}>{appName}</Heading>}
            />
            <Text fontWeight="bold" fontSize={LOGO_FONT_SIZE}></Text>
          </HStack>
        </Box>

        <Fade in={doneLoading}>
          <Flex gap={5} alignItems="center">
            <Link
              onClick={() => {
                void router.push('/schedule');
              }}
            >
              Schedule
            </Link>
            {user?.firstName ? (
              <Box>
                {user.firstName} {user.lastName}
              </Box>
            ) : (
              <>
                <Button
                  width="75%"
                  backgroundColor={colors.success}
                  marginLeft="4px"
                  onClick={async () => {
                    await signInWithSlack();
                  }}
                >
                  Sign Up
                </Button>

                <Button
                  onClick={async () => {
                    await signInWithSlack();
                  }}
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
