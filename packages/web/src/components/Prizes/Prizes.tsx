import { Table, Th, Tbody, Thead, Tr, Box, Center, VStack } from '@chakra-ui/react';
import React from 'react';
import { PrizeRow } from './PrizeRow';
import { Prize } from './PrizeRow';

export interface PrizeProps {
  prizes: Prize[];
}

export const Prizes: React.FC<PrizeProps> = ({ prizes }) => {
  let normalPrizes: Prize[] = [];
  let bonusPrizes: Prize[] = [];

  for (let i = 0; i < prizes.length; i += 1) {
    prizes[i].isBonus ? bonusPrizes.push(prizes[i]) : normalPrizes.push(prizes[i]);
  }

  return prizes.length > 0 ? (
    <VStack spacing="50px">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Prizes</Th>
            <Th>Description</Th>
            <Th>Variant</Th>
          </Tr>
        </Thead>
        <Tbody>
          {normalPrizes.map((prize: Prize) => (
            <PrizeRow prize={prize} key={prize.name} />
          ))}
        </Tbody>
      </Table>
      {bonusPrizes.length > 0 ? (
          <Table variant="simple">
            <Tbody>
              {bonusPrizes.map((prize: Prize) => (
                <PrizeRow prize={prize} key={prize.name} />
              ))}
            </Tbody>
          </Table>
      ) : (
        <div style={{ display: 'none' }}></div>
      )}
    </VStack>
  ) : (
    <Center>
      <Box>We haven&apos;t posted any prizes yet, please check back later!</Box>
    </Center>
  );
};