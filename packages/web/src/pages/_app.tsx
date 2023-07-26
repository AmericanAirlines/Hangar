import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Chakra } from '../components/Chakra';
import { defaultPageTitle, pageTitleKey } from '../components/layout/PageContainer';
import { AppLayout } from '../components/layout/AppLayout';

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <>
    <Head>
      <title key={pageTitleKey}>{defaultPageTitle}</title>
    </Head>

    <Chakra>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </Chakra>
  </>
);

export default App;
