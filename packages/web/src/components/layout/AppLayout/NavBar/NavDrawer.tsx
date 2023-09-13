import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  Fade,
  Flex,
  Link,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { signInWithSlack } from './NavBar';
import { useUserStore } from '../../../../stores/user';

type NavDrawerProps = {
  isOpen: any;
  onClose: any;
};

export const NavDrawer: React.FC<NavDrawerProps> = ({ onClose, isOpen }) => {
  const router = useRouter();
  const { user, doneLoading } = useUserStore();

  return (
    <Drawer placement="left" size={'xs'} onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerBody>
          <Fade in={doneLoading}>
            <Flex direction="column" gap={5} alignItems="center">
              {user?.firstName ? (
                <Box alignContent={'center'}>Welcome back, {user.firstName}!</Box>
              ) : (
                <>
                  <Button
                    variant="cta"
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
              <Link
                onClick={() => {
                  void router.push('/schedule');
                  onClose();
                }}
              >
                Schedule
              </Link>
            </Flex>
          </Fade>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3}>
            Admin
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
