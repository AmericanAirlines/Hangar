import { Center, Spinner } from '@chakra-ui/react';
import { colors } from '../../../theme/colors';

export const PageSpinner: React.FC = () => (
  <Center w="full" minH={'50vh'}>
    <Spinner size={{ base: 'lg', md: 'xl' }} color={colors.brandPrimary} />
  </Center>
);
