import { Tr, Td } from '@chakra-ui/react';
import React from 'react';

interface PrizeRowProps {
  prize: Prize;
  variant: 'primary' | 'secondary';
  place: number;
}

export interface Prize {
  id: string;
  name: string;
  description?: string;
  isBonus: boolean;
}

export const PrizeRow: React.FC<PrizeRowProps> = ({ prize, variant, place }) => (
  <Tr>
    <Td>{variant === 'primary' ? place : ''}</Td>
    <Td>{prize.name}</Td>
    <Td>{prize.description}</Td>
  </Tr>
);
