import React from 'react';
import { GetServerSideProps } from 'next';
import { ChakraProps, ChakraProvider } from '@chakra-ui/react';
import { theme } from '../theme';

export const Chakra: React.FC<ChakraProps & { children: React.ReactNode }> = ({ children }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
);

// Forces the page to ALWAYS be server-rendered
// Any page without this will be rendered at build time
// Usage:
// export { getServerSideProps } from '../components/Chakra';
// NOTE: This impacts performance and will cause the page to be re-rendered on every request
// The alternative is a page-flash on load by removing this
export const getServerSideProps: GetServerSideProps = async () => ({
  props: {},
});
