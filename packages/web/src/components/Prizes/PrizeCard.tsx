import { ListItem, Heading, Flex, Text, Button } from '@chakra-ui/react';
import { Prize } from '@hangar/shared';
import { useRouter } from 'next/router';
import { colors } from '../../theme';

type PrizeCardProps = {
  prize: Prize;
};

const RANKING = ['🥇', '🥈', '🥉'];
const BONUS = '✨';

export const PrizeCard: React.FC<PrizeCardProps> = ({ prize }) => {
  const router = useRouter();
  const { name, description, position, isBonus, winner } = prize;

  return (
    <ListItem background={colors.brandPrimaryDark}>
      <Flex direction="column" gap={3}>
        <Heading as="h2" size="md">
          <Flex gap={2}>
            <Text>{isBonus ? BONUS : RANKING[position]}</Text>
            <Text>{name}</Text>
          </Flex>
        </Heading>

        <Text>{description}</Text>
        {winner && (
          <Button
            onClick={() => {
              void router.push(`/project/${winner}`);
            }}
          >
            View Winner
          </Button>
        )}
      </Flex>
    </ListItem>
  );
};
