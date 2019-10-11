import React from 'react';
import { render, screen } from '../../testUtils/testTools';
import { NavLink } from '../../../src/components/NavBar/NavLink';

describe('NavLink', () => {
  it('renders correctly', async () => {
    render(<NavLink label="Test Link" href="/test/link" />);

    expect(screen.getByText('Test Link')).toBeVisible();

    expect(screen.getByRole('link')).toHaveAttribute('href', '/test/link');
  });
});
