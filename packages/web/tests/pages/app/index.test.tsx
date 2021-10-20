import React from 'react';
import { render, screen } from '../../testUtils/testTools';
import AppHome from '../../../src/pages/app';
import { getMock } from '../../testUtils/getMock';
import { AppLayout } from '../../../src/components/Layout';

jest.mock('../../../src/components/Layout/AppLayout.tsx');
getMock(AppLayout).mockImplementation(({ children }) => <>{children}</>);

describe('web /app', () => {
  it('renders', async () => {
    render(<AppHome />);

    expect(screen.getByText('App Home')).toBeVisible();
  });
});
