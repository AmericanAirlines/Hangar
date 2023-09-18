import { Button } from '@chakra-ui/react';
import { signInWithSlack } from './utils';

export const Login: React.FC = () => (
  <Button
    onClick={async () => {
      await signInWithSlack();
    }}
  >
    Login
  </Button>
);
