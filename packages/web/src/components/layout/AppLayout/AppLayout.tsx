import { Box, Center, ChakraProps, Flex } from '@chakra-ui/react';
import { colors } from '../../../theme';
import { NavBar } from './NavBar/NavBar';

type AppLayoutProps = ChakraProps & {
  children: React.ReactNode;
};

const MAX_CONTENT_WIDTH_IN_PIXELS = 1200;
const NAV_HEIGHT = '60px';

export const AppLayout: React.FC<AppLayoutProps> = ({ children, ...chakraProps }) => (
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
  </>
);
