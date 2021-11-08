import React from 'react';
import { render, screen } from '../../testUtils/testTools';
import { Prize, PrizeRow } from '../../../src/components/Prizes/PrizeRow';

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
        <PrizeRow
          variant={mockPrize.isBonus ? 'secondary' : 'primary'}
          index={0}
          prize={mockPrize}
        />,
      ),
    ).not.toThrowError();

    expect(screen.getByText('first prize')).toBeInTheDocument();
    expect(screen.getByText('a thing')).toBeInTheDocument();
  });

  it('renders a bonus prize correctly', async () => {
    expect(() =>
      render(
        <PrizeRow
          variant={mockBonusPrize.isBonus ? 'secondary' : 'primary'}
          index={0}
          prize={mockBonusPrize}
        />,
      ),
    ).not.toThrowError();

    expect(screen.getByText('second prize')).toBeInTheDocument();
    expect(screen.getByText('another thing')).toBeInTheDocument();
  });
});
