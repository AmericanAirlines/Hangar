import React from 'react';
import { render, screen } from '../../testUtils/testTools';
import { MarketingLayout } from '../../../src/components/Layout';

describe('MarketingLayout', () => {
  it('renders children', async () => {
    const text = 'Hello World';

    render(
      <MarketingLayout>
        <div>{text}</div>
      </MarketingLayout>,
    );

    expect(screen.getByText(text)).toBeVisible();
  });

  it('renders button', async () => {
    render(<MarketingLayout />);

    expect(screen.getByText('Login with GitHub')).toBeVisible();
  });
});
