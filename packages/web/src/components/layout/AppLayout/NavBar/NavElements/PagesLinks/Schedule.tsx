import React from 'react';
import { Link } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export const Schedule: React.FC = () => {
  const router = useRouter();

  return (
    <Link
      onClick={() => {
        void router.push('/schedule');
      }}
    >
      Schedule
    </Link>
  );
};
