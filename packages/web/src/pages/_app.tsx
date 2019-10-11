import React from 'react';
import { AppProps } from 'next/app';
import { Chakra } from '../components/Chakra';

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <Chakra cookies={pageProps.cookies}>
    <Component {...pageProps} />
  </Chakra>
);

export default App;
