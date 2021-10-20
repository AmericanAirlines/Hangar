import React from 'react';
import { render } from '../testUtils/testTools';
import App from '../../src/pages/_app';

describe('web _app', () => {
  it('calls the Component with the page props', async () => {
    const Component = jest.fn().mockReturnValue(null);
    const pageProps = { test: 'test' };

    render(<App {...({ Component, pageProps } as any)} />);

    expect(Component.mock.calls[0][0]).toEqual(pageProps);
  });
});
