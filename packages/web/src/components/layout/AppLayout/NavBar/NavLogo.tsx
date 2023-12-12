import { Heading } from '@chakra-ui/react';
import { Config } from '@hangar/shared';
import NextLink from 'next/link';

const LOGO_HEIGHT = { base: '24px', sm: '28px', md: '40px' };

export const NavLogo: React.FC = () => (
  <NextLink passHref href="/">
    <Heading
      as="a"
      w="full"
      variant={'cta'}
      py={3}
      px={{ base: 1, sm: 3 }}
      lineHeight={LOGO_HEIGHT}
      cursor="pointer"
      mb={1}
    >
      {Config.global.appName}
    </Heading>
  </NextLink>
);
