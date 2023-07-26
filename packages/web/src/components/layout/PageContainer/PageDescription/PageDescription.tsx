import Head from 'next/head';

interface PageDescriptionProps {
  description: string;
}

export const pageDescriptionKey = 'description';
export const ogPageDescriptionKey = 'ogDescription';

export const PageDescription: React.FC<PageDescriptionProps> = ({ description }) => (
  <Head>
    <meta
      name="description"
      property="og:description"
      key={ogPageDescriptionKey}
      content={description}
    />
  </Head>
);
