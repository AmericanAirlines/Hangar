import React from 'react';
import { render, screen } from '../../testUtils/testTools';
import { Prize, PrizeRow } from '../../../src/components/Prizes/PrizeRow';

jest.mock('@chakra-ui/react', () => {
  const chakra = jest.requireActual('@chakra-ui/react');
  const MockIconComponent = () => <div data-testid="mock-icon">Mock icon</div>;

  return {
    ...chakra,
    Icon: MockIconComponent,
  };
});

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

  it('renders a primary prize with an icon', async () => {
    expect(() =>
      render(<PrizeRow variant="primary" index={0} prize={mockPrize} />),
    ).not.toThrowError();

    expect(screen.queryByText(mockPrize.name)).toBeVisible();
    expect(screen.queryByText(mockPrize.description!)).toBeVisible();
    expect(screen.queryByTestId('mock-icon')).toBeVisible();
  });

  it('renders a secondary prize without an icon', async () => {
    expect(() =>
      render(<PrizeRow variant="secondary" index={0} prize={mockBonusPrize} />),
    ).not.toThrowError();

    expect(screen.queryByText(mockBonusPrize.name)).toBeVisible();
    expect(screen.queryByText(mockBonusPrize.description!)).toBeVisible();
    expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
  });
});
