import { HStack, VStack, Heading, Text, Icon, useColorModeValue } from '@chakra-ui/react';
import { BsStarFill } from 'react-icons/bs';
import React from 'react';

interface PrizeRowProps {
  prize: Prize;
  variant: 'primary' | 'secondary';
  index: number;
}

export interface Prize {
  id: string;
  name: string;
  description?: string;
  isBonus: boolean;
}

export const PrizeRow: React.FC<PrizeRowProps> = ({ prize, variant, index }) => (
  <VStack alignItems="stretch" spacing={0}>
    <HStack>
      {variant === 'primary' ? (
        <Icon
          as={BsStarFill}
          color={['gold', 'gray.300', 'orange.400', 'gray.600'][Math.max(0, Math.min(3, index))]}
        />
      ) : null}
      <Heading as="p" size="sm">
        {prize.name}
      </Heading>
    </HStack>
    <Text color={useColorModeValue('gray.500', 'gray.400')}>{prize.description}</Text>
  </VStack>
);
