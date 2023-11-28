import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';

export const Schedule: React.FC = () => (
  <NextLink passHref href="/schedule">
    <Link>Schedule</Link>
  </NextLink>
);
