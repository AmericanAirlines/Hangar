import { Link } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export const AdminDashboard: React.FC = () => {
  const router = useRouter();

  return (
    <Link
      onClick={() => {
        void router.push('/admin/dashboard');
      }}
    >
      Admin Dashboard
    </Link>
  );
};
