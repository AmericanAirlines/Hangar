import React from 'react';
import { NextPage } from 'next';
import { MarketingLayout } from '../../components/Layout';
import { useRouter } from 'next/router';
import { UserProfile } from '../../components/userprofile/UserProfile';
import { Alert, AlertIcon } from '@chakra-ui/alert';

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

    fetchUser();
  }, [uid]);

  if (user === undefined) {
    if (errorMessage == '') return null;
    else
      return (
        <MarketingLayout>
          <Alert status="error">
            <AlertIcon />
            {errorMessage}
          </Alert>
        </MarketingLayout>
      );
  } else {
    return (
      <MarketingLayout>
        <UserProfile {...user} />
      </MarketingLayout>
    );
  }
};

export default UserProfilePage;
