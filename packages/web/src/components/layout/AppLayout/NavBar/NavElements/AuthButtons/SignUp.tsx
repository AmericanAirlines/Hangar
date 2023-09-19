import { Button } from '@chakra-ui/react';
import { colors } from '../../../../../../theme';
import { signInWithSlack } from './utils';

type SignUpProps = {
  mentionLogin?: boolean;
};

export const SignUp: React.FC<SignUpProps> = ({ mentionLogin }) => (
  <Button
    backgroundColor={colors.success}
    onClick={async () => {
      await signInWithSlack();
    }}
    size={{ base: 'sm', sm: 'md' }}
  >
    {`Sign Up${mentionLogin ? ' or Login' : ''}`}
  </Button>
);
