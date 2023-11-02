import { Link } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export const Prizes: React.FC = () => {
  const router = useRouter();

  return (
    <Link
      onClick={() => {
        void router.push('/#prizes');
      }}
    >
      Prizes
    </Link>
  );
};
