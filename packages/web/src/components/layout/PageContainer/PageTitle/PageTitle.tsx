import Head from 'next/head';
import { appName } from '@hangar/shared';

interface PageTitleProps {
  title: string;
}

export const pageTitleKey = 'title';
export const ogPageTitleKey = 'ogTitle';
export const defaultPageTitle = appName;

export const PageTitle: React.FC<PageTitleProps> = ({ title }) => (
  <Head>
    <title key={pageTitleKey}>{title}</title>
    <meta property="og:title" key={ogPageTitleKey} content={title} />
  </Head>
);
