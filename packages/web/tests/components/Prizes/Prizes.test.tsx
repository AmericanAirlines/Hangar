import React from 'react';
import { render, screen } from '../../testUtils/testTools';
import { getMock } from '../../testUtils/getMock';
import { Prizes } from '../../../src/components/Prizes';
import { PrizeRow, Prize } from '../../../src/components/Prizes/PrizeRow';
import { Td, Tr } from '@chakra-ui/react';

jest.mock('../../../src/components/Prizes/PrizeRow.tsx');

getMock(PrizeRow).mockImplementation(() => (
  <Tr>
    <Td>{'text'}</Td>
  </Tr>
));

const mockPrize: Prize =
  {
    id: '1',
    name: 'first prize',
    description: 'the very first one',
    isBonus: true,
  };

const mockBonusPrize: Prize =
  {
    id: '2',
    name: 'second prize',
    isBonus: false,
  };

describe('Prize component testing', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('renders both regular prizes and bonus prizes correctly', async () => {
    expect(() => render(<Prizes prizes={[mockPrize, mockBonusPrize]} />)).not.toThrowError();
    expect(PrizeRow).toBeCalledTimes(2);
    expect(screen.getByText('text')).toBeInTheDocument();
  });

  it('renders only bonus prizes if there are only bonus prizes', async () => {
    expect(() => render(<Prizes prizes={[mockBonusPrize]} />)).not.toThrowError();
    expect(PrizeRow).toBeCalledTimes(1);
    expect(screen.getByText('text')).toBeInTheDocument();
  });

  it('renders only bonus prizes if there are only normal prizes', async () => {
    expect(() => render(<Prizes prizes={[mockPrize]} />)).not.toThrowError();
    expect(PrizeRow).toBeCalledTimes(1);
    expect(screen.getByText('text')).toBeInTheDocument();
  });

  it('does not render anything except a message if there are no prizes', async () => {
    expect(() => render(<Prizes prizes={[]} />)).not.toThrowError();
    const errorMessage = "We haven't posted any prizes yet, please check back later!";
    expect(PrizeRow).toBeCalledTimes(0);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
