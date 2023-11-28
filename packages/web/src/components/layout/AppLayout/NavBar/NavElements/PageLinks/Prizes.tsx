import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';

export const Prizes: React.FC = () => (
  <NextLink passHref href="/#prizes">
    <Link>Prizes</Link>
  </NextLink>
);
