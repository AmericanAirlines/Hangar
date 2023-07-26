import Head from 'next/head';

interface PageImageProps {
  imagePath: string;
}

export const pageImageKey = 'image';
export const ogPageImageKey = 'ogImage';

export const PageImage: React.FC<PageImageProps> = ({ imagePath }) => (
  <Head>
    <meta name="image" property="og:image" key={ogPageImageKey} content={imagePath} />
  </Head>
);
