import { Tr, Td } from '@chakra-ui/react';
import React from 'react';

interface PrizeRowProps {
  prize: Prize;
}

export interface Prize {
  id: string;
  name: string;
  description?: string;
  isBonus: boolean;
}

export const PrizeRow: React.FC<PrizeRowProps> = ({ prize }) => {
  return (
    <Tr>
      <Td>{prize.name}</Td>
      <Td>{prize.description}</Td>
      <Td>{prize.isBonus ? 'secondary' : 'primary'}</Td>
    </Tr>
  );
};
