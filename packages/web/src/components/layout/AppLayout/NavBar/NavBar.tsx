import {
  Box,
  HStack,
  Heading,
  Image,
  Spacer,
  Text,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  Button,
  IconButton,
  VStack,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { appName } from '@hangar/shared';
import { statusColors } from '../../../../theme';

const LOGO_HEIGHT = { base: '24px', sm: '28px', md: '40px' };
const LOGO_FONT_SIZE = { base: '22px', md: '33px' };

export const NavBar: React.FC = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <HStack width="full">
        <IconButton
          aria-label="Navigation Menu"
          colorScheme="whiteAlpha"
          icon={<HamburgerIcon />}
          display={{ base: 'inline', lg: 'none' }}
          onClick={onOpen}
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
            <Button width="75%" backgroundColor={statusColors.alert} marginLeft="4px">
              Sign Up
            </Button>
            <Button>Login</Button>
          </HStack>
        </Box>
      </HStack>

      <Spacer />

      <Drawer placement="left" size={'xs'} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody>
            <VStack>
              <Button>Sign Up</Button>
              <Button>Login</Button>
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3}>
              Admin
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
