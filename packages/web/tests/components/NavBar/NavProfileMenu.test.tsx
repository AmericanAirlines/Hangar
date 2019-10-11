import React from 'react';
import { render, screen } from '../../testUtils/testTools';
import { NavProfileMenu } from '../../../src/components/NavBar/NavProfileMenu';

describe('NavLink Components', () => {
  it('renders correctly', async () => {
    render(<NavProfileMenu />);

    expect(screen.getByRole('img')).toBeVisible();

    expect(screen.getByText('Edit Profile')).toHaveAttribute('href', '/app/profile');
    expect(screen.getByText('View Contributions')).toHaveAttribute('href', '/app/contributions');
    expect(screen.getByText('Log Out')).toHaveAttribute('href', '/app/logout');
  });
});
