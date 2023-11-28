import { Link } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useUserStore } from '../../../../../../stores/user';

export const MyProject: React.FC = () => {
  const router = useRouter();
  const { user } = useUserStore();

  if (!user?.project) return null;

  return (
    <Link
      flexShrink={0}
      onClick={() => {
        void router.push(`/project/${user.project}`);
      }}
    >
      My Project
    </Link>
  );
};
