import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  Fade,
  VStack,
} from '@chakra-ui/react';
import { signInWithSlack } from './NavBar';
import { useUserStore } from '../../../../stores/user';

type NavDrawerProps = {
  isOpen: any;
  onClose: any;
};

export const NavDrawer: React.FC<NavDrawerProps> = (props) => {
  const { user, doneLoading } = useUserStore((state: any) => state);

  return (
    <Drawer placement="left" size={'xs'} onClose={props.onClose} isOpen={props.isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerBody>
          <Fade in={doneLoading}>
            <Box>
              {user?.firstName ? (
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
