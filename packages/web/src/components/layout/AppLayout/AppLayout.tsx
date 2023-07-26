import {
  Box,
  Center,
  ChakraProps,
  Flex,
  HStack,
  Heading,
  Image,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { appName } from '@hangar/shared';
import { colors } from '../../../theme';

type AppLayoutProps = ChakraProps & {
  children: React.ReactNode;
};

const MAX_CONTENT_WIDTH_IN_PIXELS = 1200;
const NAV_HEIGHT = '60px';
const LOGO_HEIGHT = { base: '24px', sm: '28px', md: '40px' };
const LOGO_FONT_SIZE = { base: '22px', md: '33px' };

export const AppLayout: React.FC<AppLayoutProps> = ({ children, ...chakraProps }) => {
  const router = useRouter();

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
          <Box
            onClick={() => {
              void router.push('/');
            }}
            cursor="pointer"
          >
            <HStack as="a" py={3} spacing={2} lineHeight={LOGO_HEIGHT}>
              <Image
                alt="logo"
                src={'/Logo.svg'}
                height={LOGO_HEIGHT}
                fallback={<Heading>{appName}</Heading>}
              />
              <Text fontWeight="bold" fontSize={LOGO_FONT_SIZE}></Text>
            </HStack>
          </Box>

          <Spacer />

          {/* Add nav elements here */}
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
};
