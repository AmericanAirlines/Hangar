import { Button } from '@chakra-ui/react';
import { colors } from '../../../../../../theme';
import { triggerRedirect } from '../../../../RedirectToAuthModal/useRedirectToAuth';

type SignUpProps = {
  mentionLogin?: boolean;
};

export const SignUp: React.FC<SignUpProps> = ({ mentionLogin }) => (
  <Button
    backgroundColor={colors.success}
    onClick={() => {
      triggerRedirect();
    }}
    size={{ base: 'sm', sm: 'md' }}
  >
    {`Sign Up${mentionLogin ? ' or Login' : ''}`}
  </Button>
);
