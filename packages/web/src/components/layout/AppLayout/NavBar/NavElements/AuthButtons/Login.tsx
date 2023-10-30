import { Button } from '@chakra-ui/react';
import { triggerRedirect } from '../../../../RedirectToAuthModal/useRedirectToAuth';

export const Login: React.FC = () => (
  <Button
    onClick={() => {
      triggerRedirect();
    }}
  >
    Login
  </Button>
);
