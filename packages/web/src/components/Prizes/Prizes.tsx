import React from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { useToast, UseToastOptions } from '@chakra-ui/react';
import { Prize, SerializedPrize } from '@hangar/shared';
import { PrizesList } from './PrizesList';

const FAILED_FETCH_TOAST: UseToastOptions = {
  title: 'An error occurred.',
  description: 'Unable to fetch prizes.',
  status: 'error',
  duration: 3000,
  isClosable: true,
};

const fetchPrizes: () => Promise<Prize[]> = async () =>
  (await axios.get<SerializedPrize[]>('/api/prize')).data.map((serializedPrize) => {
    const { createdAt, updatedAt, ...rest } = serializedPrize;
    return {
      ...rest,
      createdAt: dayjs(createdAt),
      updatedAt: dayjs(updatedAt),
    };
  });

export const Prizes: React.FC = () => {
  const [prizes, setPrizes] = React.useState<Prize[]>([]);
  const toast = useToast();

  React.useEffect(() => {
    const fetchAndSetPrizes = async () => {
      try {
        setPrizes(await fetchPrizes());
      } catch {
        toast(FAILED_FETCH_TOAST);
      }
    };

    void fetchAndSetPrizes();
  }, [toast]);

  return <PrizesList {...{ prizes }} />;
};
