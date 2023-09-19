import { ListItem, Heading, Flex, Text } from '@chakra-ui/react';
import { Prize } from '@hangar/shared';
import { colors } from '../../theme';

type PrizeCardProps = {
  prize: Prize;
};

const RANKING = ['🥇', '🥈', '🥉'];
const BONUS = '✨';

export const PrizeCard: React.FC<PrizeCardProps> = ({ prize }) => {
  const { name, description, position, isBonus } = prize;

  return (
    <ListItem background={colors.brandPrimaryDark}>
      <Heading as="h2" size="md">
        <Flex gap={2}>
          <Text>{isBonus ? BONUS : RANKING[position]}</Text>
          <Text>{name}</Text>
        </Flex>
      </Heading>

      <Text>{description}</Text>
    </ListItem>
  );
};
