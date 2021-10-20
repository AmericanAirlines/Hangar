import React from 'react';
import { render, screen } from '../testUtils/testTools';
import { Chakra, getServerSideProps } from '../../src/components/Chakra';

describe('Chakra', () => {
  it('renders children', async () => {
    const text = 'Hello World';

    render(
      <Chakra cookies="">
        <div>{text}</div>
      </Chakra>,
    );

    expect(screen.getByText(text)).toBeVisible();
  });

  describe('getServerSideProps', () => {
    it('returns cookies from req', async () => {
      const mockCookie = 'mock-cookies';
      const props = await getServerSideProps({ req: { headers: { cookie: mockCookie } } } as any);

      expect(props).toEqual({
        props: {
          cookies: mockCookie,
        },
      });
    });

    it('returns empty cookies from req when the cookie header is undefined', async () => {
      const props = await getServerSideProps({ req: { headers: { cookie: undefined } } } as any);

      expect(props).toEqual({
        props: {
          cookies: '',
        },
      });
    });
  });
});
