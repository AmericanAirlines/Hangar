import React from 'react';
import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import { ChakraProvider, cookieStorageManager } from '@chakra-ui/react';
import { theme } from '../theme';

interface ChakraProps {
  cookies: string;
}

export const Chakra: React.FC<ChakraProps> = ({ cookies, children }) => (
  <ChakraProvider theme={theme} colorModeManager={cookieStorageManager(cookies)}>
    {children}
  </ChakraProvider>
);

/**
 * Sends the cookies to the page to remove the flash. This disables the static
 * page generation when exported from a page, so only use it on pages where you
 * think most users will go to the url directly (the homepage, etc)
 *
 * Add it to a page like this
 *
 * `export { getServerSideProps } from '../components/Chakra';`
 */
export const getServerSideProps: GetServerSideProps = async ({
  req,
}): Promise<GetServerSidePropsResult<ChakraProps>> => {
  return {
    props: {
      cookies: req.headers.cookie ?? '',
    },
  };
};
