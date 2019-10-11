import React from 'react';
import { render, screen } from '../../testUtils/testTools';
import { AppLayout } from '../../../src/components/Layout';
import { NavBar } from '../../../src/components/NavBar';
import { getMock } from '../../testUtils/getMock';

jest.mock('../../../src/components/NavBar/NavBar.tsx');
getMock(NavBar).mockImplementation(() => <p>NavBar</p>);
describe('AppLayout', () => {
  it('renders children', async () => {
    const text = 'Hello World';

    render(
      <AppLayout>
        <div>{text}</div>
      </AppLayout>,
    );

    expect(screen.getByText(text)).toBeVisible();
    expect(screen.getByText('NavBar')).toBeVisible();
  });
});
