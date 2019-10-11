import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Alert, AlertIcon } from '@chakra-ui/react';
import { MarketingLayout } from '../../components/Layout';
import { UserProfile } from '../../components/userprofile/UserProfile';

export interface User {
  name: string;
  pronouns?: string;
  schoolName?: string;
}

const UserProfilePage: NextPage = () => {
  const router = useRouter();
  const { uid } = router.query;

  const [user, setUser] = React.useState<User>();
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  React.useEffect(() => {
    const fetchUser = async () => {
      if (!Number.isNaN(Number(uid))) {
        try {
          const res = await fetch(`/api/users/${uid}`);
          const data = await res.json();

          setUser(data);
        } catch {
          setErrorMessage('User could not be found');
        }
      } else {
        setErrorMessage('User id malformed');
      }
    };

    void fetchUser();
  }, [uid]);

  return (
    <MarketingLayout>
      {!errorMessage && user ? (
        <UserProfile user={user} />
      ) : (
        <Alert status="error">
          <AlertIcon />
          {errorMessage}
        </Alert>
      )}
    </MarketingLayout>
  );
};

export default UserProfilePage;
