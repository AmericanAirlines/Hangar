import { Alert, AlertDescription, AlertIcon, Center, Spinner, VStack } from '@chakra-ui/react';
import React from 'react';
import { PrizeRow, Prize } from './PrizeRow';

export const Prizes: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [prizes, setPrizes] = React.useState<Prize[]>([]);

  React.useEffect(() => {
    const fetchPrizes = async () => {
      const res = await fetch('/api/prizes');

      try {
        if (!res.ok) {
          throw new Error();
        }

        const data = await res.json();
        setPrizes(data);
      } catch (err) {
        setError('There was an error fetching prizes');
      }

      setLoading(false);
    };

    void fetchPrizes();
  }, []);

  if (loading) {
    return (
      <Center height={24}>
        <Spinner />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert status="error" rounded="2xl">
        <AlertIcon />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (prizes.length === 0) {
    return (
      <Alert status="info" rounded="2xl">
        <AlertIcon />
        <AlertDescription>Prizes are not visible yet</AlertDescription>
      </Alert>
    );
  }

  return (
    <VStack alignItems="stretch" spacing={3}>
      {prizes.map((prize: Prize, index: number) => (
        <PrizeRow
          variant={prize.isBonus ? 'secondary' : 'primary'}
          index={index}
          prize={prize}
          key={prize.name}
        />
      ))}
    </VStack>
  );
};
