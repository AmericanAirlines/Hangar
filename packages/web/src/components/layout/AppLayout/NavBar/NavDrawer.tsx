import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  VStack,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { signInWithSlack } from './NavBar';
import { useUserStore } from '../../../../stores/user';

type NavDrawerProps = {
  isOpen: any;
  onClose: any;
  doneLoading: boolean;
};

export const NavDrawer: React.FC<NavDrawerProps> = (props) => {
  const { user, doneLoading, fetchUser } = useUserStore((state: any) => state);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <Drawer placement="left" size={'xs'} onClose={props.onClose} isOpen={props.isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerBody>
          {doneLoading ? (
            <Box>
              {user.firstName ? (
                <Box alignContent={'center'}>Welcome back, {user.firstName}!</Box>
              ) : (
                <VStack>
                  <Button
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
                </VStack>
              )}
            </Box>
          ) : (
            <Box>Loading...</Box>
          )}
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
