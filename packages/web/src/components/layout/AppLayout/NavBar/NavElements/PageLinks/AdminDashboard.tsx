import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';

export const AdminDashboard: React.FC = () => (
  <NextLink passHref href="/admin/dashboard">
    <Link>Admin Dashboard</Link>
  </NextLink>
);
