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
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { appName } from '@hangar/shared';
import { colors } from '../../../../theme';
import { NavDrawer } from './NavDrawer';

const LOGO_HEIGHT = { base: '24px', sm: '28px', md: '40px' };
const LOGO_FONT_SIZE = { base: '22px', md: '33px' };

export async function signInWithSlack() {
  window.location.href = '/api/auth/';
}

export const NavBar: React.FC = () => {
  const router = useRouter();
  const { onOpen, onClose, isOpen } = useDisclosure();
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

        <Box display={{ base: 'none', lg: 'inline' }}>
          <HStack float="right" width="full">
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
          </HStack>
        </Box>
      </HStack>

      <Spacer />

      <NavDrawer isOpen={isOpen} onClose={onClose} />
    </>
  );
};