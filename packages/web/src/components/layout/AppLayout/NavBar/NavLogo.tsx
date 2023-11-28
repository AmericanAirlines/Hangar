import { Heading } from '@chakra-ui/react';
import { Config } from '@hangar/shared';
import { useRouter } from 'next/router';

const LOGO_HEIGHT = { base: '24px', sm: '28px', md: '40px' };

export const NavLogo: React.FC = () => {
  const router = useRouter();

  return (
    <Heading
      variant={'cta'}
      py={3}
      px={{ base: 1, sm: 3 }}
      lineHeight={LOGO_HEIGHT}
      cursor="pointer"
      mb={1}
      onClick={() => {
        void router.push('/');
      }}
    >
      {Config.global.appName}
    </Heading>
  );
};
