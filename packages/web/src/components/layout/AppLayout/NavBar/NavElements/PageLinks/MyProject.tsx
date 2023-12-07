import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useUserStore } from '../../../../../../stores/user';

export const MyProject: React.FC = () => {
  const { user } = useUserStore();

  if (!user?.project) return null;

  return (
    <NextLink passHref href={`/project/${user.project}`}>
      <Link flexShrink={0}>My Project</Link>
    </NextLink>
  );
};
