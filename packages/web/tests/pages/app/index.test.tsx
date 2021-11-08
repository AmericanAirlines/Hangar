import React from 'react';
import { render, screen } from '../../testUtils/testTools';
import AppHome from '../../../src/pages/app';
import { getMock } from '../../testUtils/getMock';
import { AppLayout } from '../../../src/components/Layout';
import { Prizes } from '../../../src/components/Prizes';
import { Schedule } from '../../../src/components/Schedule';

jest.mock('../../../src/components/Layout/AppLayout.tsx');
getMock(AppLayout).mockImplementation(({ children }) => <>{children}</>);

jest.mock('../../../src/components/Prizes');
getMock(Prizes).mockImplementation(() => <div>Mock Prizes</div>);

jest.mock('../../../src/components/Schedule');
getMock(Schedule).mockImplementation(() => <div>Mock Schedule</div>);

describe('web /app', () => {
  it('renders', async () => {
    render(<AppHome />);

    expect(screen.queryByText('Welcome')).toBeVisible();
  });
});
