import React from 'react';
import { Flex, Heading, UnorderedList } from '@chakra-ui/react';
import { usePrizesStore } from '../../stores/prizes';
import { PrizeCard } from './PrizeCard';

type PrizesProps = {};

export const Prizes: React.FC<PrizesProps> = () => {
  const { prizes } = usePrizesStore();

  if (!prizes?.length) return null;

  return (
    <Flex direction="column" gap={3}>
      <Heading>Prizes</Heading>

      <UnorderedList variant="card" m={0} spacing={5}>
        {prizes.map((prize) => (
          <PrizeCard {...{ prize }} key={`prize-${prize.id}`} />
        ))}
      </UnorderedList>
    </Flex>
  );
};
