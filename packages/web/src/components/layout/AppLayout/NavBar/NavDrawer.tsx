import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Fade,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import React from 'react';
import { useRouter } from 'next/router';
import { MdClose } from 'react-icons/md';
import { useUserStore } from '../../../../stores/user';
import { Logout } from './NavElements/AuthButtons/Logout';
import { NavLogo } from './NavLogo';
import { Schedule } from './NavElements/PageLinks/Schedule';
import { useAdminStore } from '../../../../stores/admin';
import { AdminDashboard } from './NavElements/PageLinks/AdminDashboard';

type NavDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const NavDrawer: React.FC<NavDrawerProps> = ({ onClose, isOpen }) => {
  const router = useRouter();
  const { user, doneLoading } = useUserStore();
  const { admin } = useAdminStore();

  React.useEffect(() => {
    // Close the menu if the route changes
    router.events.on('routeChangeStart', onClose);
  }, [onClose, router.events]);

  return (
    <Drawer placement="left" size={'xs'} onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />

      <DrawerContent>
        <DrawerBody>
          <Fade in={doneLoading}>
            <Flex direction="column" gap={5} alignItems="left">
              <Flex position="relative" w="full" justify="center" alignItems="center">
                <NavLogo />

                <IconButton aria-label="Close nav button" icon={<MdClose />} onClick={onClose} />
              </Flex>

              <Schedule />

              {admin && <AdminDashboard />}

              {user && <Logout />}
            </Flex>
          </Fade>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
