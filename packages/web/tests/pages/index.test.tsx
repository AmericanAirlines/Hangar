import React from 'react';
import { render } from '../testUtils/testTools';
import Home, { getServerSideProps } from '../../src/pages';
import { getMock } from '../testUtils/getMock';
import { MarketingLayout } from '../../src/components/Layout';
import { getServerSideProps as chakraGetServerSideProps } from '../../src/components/Chakra';

jest.mock('../../src/components/Layout/MarketingLayout.tsx');
getMock(MarketingLayout).mockImplementation(({ children }) => <>{children}</>);

describe('web /', () => {
  it('renders', async () => {
    expect(() => render(<Home />)).not.toThrow();
  });

  it('exports chakra getServerSideProps for dark mode cookies', () => {
    expect(getServerSideProps).toBe(chakraGetServerSideProps);
  });
});
