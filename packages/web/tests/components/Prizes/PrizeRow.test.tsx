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
    id: '1',
    name: 'first prize',
    description: 'a thing',
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
            <PrizeRow prize={mockPrize} />
          </Tbody>
        </Table>,
      ),
    ).not.toThrowError();

    expect(screen.getByText('first prize')).toBeInTheDocument();
    expect(screen.getByText('a thing')).toBeInTheDocument();
    expect(screen.getByText('primary')).toBeInTheDocument();
  });

  it('renders a normal prize correctly', async () => {
    expect(() =>
      render(
        <Table>
          <Tbody>
            <PrizeRow prize={mockBonusPrize} />
          </Tbody>
        </Table>,
      ),
    ).not.toThrowError();

    expect(screen.getByText('first prize')).toBeInTheDocument();
    expect(screen.getByText('a thing')).toBeInTheDocument();
    expect(screen.getByText('secondary')).toBeInTheDocument();
  });
});
