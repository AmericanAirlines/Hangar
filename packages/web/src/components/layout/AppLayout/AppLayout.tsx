import React from 'react';
import { Box, Center, ChakraProps, Flex, useColorMode } from '@chakra-ui/react';
import { colors, forcedColorMode } from '../../../theme';
import { NavBar } from './NavBar/NavBar';
import { useUserStore } from '../../../stores/user';
import { useAdminStore } from '../../../stores/admin';
import { CustomToast } from '../../utils/CustomToast/CustomToast';

type AppLayoutProps = ChakraProps & {
  children: React.ReactNode;
};

const MAX_CONTENT_WIDTH_IN_PIXELS = 1200;
const NAV_HEIGHT = '60px';

export const AppLayout: React.FC<AppLayoutProps> = ({ children, ...chakraProps }) => {
  const { setColorMode } = useColorMode();
  React.useEffect(() => setColorMode(forcedColorMode), [setColorMode]); // Make sure the color mode resets on load

  React.useEffect(() => {
    void useUserStore.getState().fetchUser();
    void useAdminStore.getState().fetchAdmin();
  }, []);

  return (
    <>
      <Box w="full" marginBottom={4} px={4} bgColor={colors.brandPrimary}>
        <Flex
          as="nav"
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="center"
          maxW={MAX_CONTENT_WIDTH_IN_PIXELS}
          marginX="auto"
          gap={0}
          minH={NAV_HEIGHT}
        >
          <NavBar />
        </Flex>
      </Box>

      <Center>
        <Flex
          width="100%"
          maxWidth={`${MAX_CONTENT_WIDTH_IN_PIXELS}px`}
          alignItems="stretch"
          direction="column"
          {...chakraProps}
        >
          {children}
        </Flex>
      </Center>
      <CustomToast />
    </>
  );
};
