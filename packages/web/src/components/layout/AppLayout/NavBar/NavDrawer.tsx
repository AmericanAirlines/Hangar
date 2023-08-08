import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  VStack,
} from '@chakra-ui/react';
import { signInWithSlack } from './NavBar';

type NavDrawerProps = {
  isOpen: any;
  onClose: any;
};

export const NavDrawer: React.FC<NavDrawerProps> = (props) => (
  <Drawer placement="left" size={'xs'} onClose={props.onClose} isOpen={props.isOpen}>
    <DrawerOverlay />
    <DrawerContent>
      <DrawerBody>
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
      </DrawerBody>

      <DrawerFooter>
        <Button variant="outline" mr={3}>
          Admin
        </Button>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
);
