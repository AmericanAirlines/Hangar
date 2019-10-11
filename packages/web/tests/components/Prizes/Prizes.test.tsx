import React from 'react';
import fetchMock from 'fetch-mock-jest';
import { render, screen, waitFor } from '../../testUtils/testTools';
import { getMock } from '../../testUtils/getMock';
import { Prizes } from '../../../src/components/Prizes';
import { PrizeRow, Prize } from '../../../src/components/Prizes/PrizeRow';

jest.mock('../../../src/components/Prizes/PrizeRow.tsx');
getMock(PrizeRow).mockImplementation(({ prize }) => <div data-testid={prize.id}>prize row</div>);

const mockPrizes: Prize[] = [
  {
    id: '1',
    name: 'first prize',
    description: 'the very first one',
    isBonus: true,
  },
  {
    id: '2',
    name: 'second prize',
    isBonus: false,
  },
];

describe('Prize component testing', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('renders a loading spinner when prizes are being fetched', async () => {
    fetchMock.getOnce('/api/prizes', mockPrizes);

    render(<Prizes />);

    await waitFor(() => {
      expect(screen.queryByText('Loading', { exact: false })).toBeVisible();
    });
  });

  it('renders a PrizeRow for each prize fetched', async () => {
    fetchMock.getOnce('/api/prizes', mockPrizes);

    render(<Prizes />);

    await waitFor(() => {
      expect(PrizeRow).toBeCalledTimes(2);
    });

    expect(PrizeRow).toHaveBeenCalledWith(
      expect.objectContaining({ prize: mockPrizes[0] }),
      expect.anything(),
    );

    expect(PrizeRow).toHaveBeenCalledWith(
      expect.objectContaining({ prize: mockPrizes[1] }),
      expect.anything(),
    );

    expect(screen.queryByTestId(mockPrizes[0].id)).toBeVisible();
    expect(screen.queryByTestId(mockPrizes[1].id)).toBeVisible();
  });

  it('renders info message if there are no prizes', async () => {
    fetchMock.getOnce('/api/prizes', []);

    render(<Prizes />);

    await waitFor(async () => {
      expect(screen.queryByText('Prizes are not visible yet')).toBeVisible();
    });
  });

  it('renders error message if prizes cannot be fetched', async () => {
    fetchMock.getOnce('/api/prizes', 500);

    render(<Prizes />);

    await waitFor(async () => {
      expect(screen.queryByText('There was an error fetching prizes')).toBeVisible();
    });
  });
});
