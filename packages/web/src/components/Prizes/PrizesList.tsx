import React from 'react';
import { Prize } from '@hangar/shared';
import { Flex, Heading, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import { colors } from '../../theme/colors';

type PrizeCardProps = {
  prize: Prize;
};

type PrizesListProps = {
  prizes: Prize[];
};

const RANKING= [ '🥇', '🥈', '🥉' ];
const BONUS = '✨';

const PrizeCard: React.FC<PrizeCardProps> = ({ prize }) => {
  const { name, description, position, isBonus } = prize;

  return (
    <ListItem background={colors.brandPrimaryDark}>
      <Heading as="h2" size="md">
        <Flex gap={2}>
          <Text>
            { isBonus // eslint-disable-line 
              ? BONUS
              : position < RANKING.length
                ? RANKING[position]
                : null
            }
          </Text>
          <Text>
            {name}
          </Text>
        </Flex>
      </Heading>
      
      <Text>
        {description}
      </Text>
    </ListItem>
  );
}

export const PrizesList: React.FC<PrizesListProps> = ({ prizes }) => (
  <UnorderedList variant="card">
    {prizes.map((prize) => (
      <PrizeCard {...{ prize }}  key={`prize-${prize.id}`} />
    ))}
  </UnorderedList>
);
