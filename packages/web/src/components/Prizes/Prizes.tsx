import { Table, Th, Tbody, Thead, Tr, Box, Center } from '@chakra-ui/react';
import React from 'react';
import { PrizeRow, Prize } from './PrizeRow';

export interface PrizeProps {
  prizes: Prize[];
}

export const Prizes: React.FC<PrizeProps> = ({ prizes }) =>
  prizes.length > 0 ? (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Prize Placement</Th>
          <Th>Prizes</Th>
          <Th>Description</Th>
        </Tr>
      </Thead>
      <Tbody>
        {prizes.map((prize: Prize, index: number) => (
          <PrizeRow
            variant={prize.isBonus ? 'secondary' : 'primary'}
            place={index + 1}
            prize={prize}
            key={prize.name}
          />
        ))}
      </Tbody>
    </Table>
  ) : (
    <Center>
      <Box>We haven&apos;t posted any prizes yet, please check back later!</Box>
    </Center>
  );
