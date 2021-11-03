import React from 'react';
import { render, screen } from '../../testUtils/testTools';
import { Prize, PrizeRow } from '../../../src/components/Prizes/PrizeRow';
import { Table, Tbody } from '@chakra-ui/table';

const mockPrize: Prize = {
  id: '1',
  name: 'first prize',
  description: 'a thing',
  isBonus: false,
};

const mockBonusPrize: Prize = {
  id: '2',
  name: 'second prize',
  description: 'another thing',
  isBonus: true,
};

describe('Prize Row testing', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('renders a normal prize correctly', async () => {
    expect(() =>
      render(
        <Table>
          <Tbody>
            <PrizeRow
              variant={mockPrize.isBonus ? 'secondary' : 'primary'}
              place={1}
              prize={mockPrize}
            />
          </Tbody>
        </Table>,
      ),
    ).not.toThrowError();

    expect(screen.getByText('first prize')).toBeInTheDocument();
    expect(screen.getByText('a thing')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders a bonus prize correctly', async () => {
    expect(() =>
      render(
        <Table>
          <Tbody>
            <PrizeRow
              variant={mockBonusPrize.isBonus ? 'secondary' : 'primary'}
              place={1}
              prize={mockBonusPrize}
            />
          </Tbody>
        </Table>,
      ),
    ).not.toThrowError();

    expect(screen.getByText('second prize')).toBeInTheDocument();
    expect(screen.getByText('another thing')).toBeInTheDocument();
  });
});
