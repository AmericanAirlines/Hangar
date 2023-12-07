import { ListItem, Heading, Flex, Text, Button } from '@chakra-ui/react';
import { Prize } from '@hangar/shared';
import NextLink from 'next/link';
import { colors } from '../../theme';

type PrizeCardProps = {
  prize: Prize;
};

const RANKING = ['🥇', '🥈', '🥉'];
const BONUS = '✨';

export const PrizeCard: React.FC<PrizeCardProps> = ({ prize }) => {
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
          <NextLink passHref href={`/project/${winner}`}>
            <Button as="a">View Winner</Button>
          </NextLink>
        )}
      </Flex>
    </ListItem>
  );
};
