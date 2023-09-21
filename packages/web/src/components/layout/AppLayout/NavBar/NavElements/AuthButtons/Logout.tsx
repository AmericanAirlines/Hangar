import { Button } from '@chakra-ui/react';

export const Logout: React.FC = () => (
  <Button
    onClick={() => {
      window.location.href = '/api/auth/logout';
    }}
  >
    {`Logout`}
  </Button>
);
