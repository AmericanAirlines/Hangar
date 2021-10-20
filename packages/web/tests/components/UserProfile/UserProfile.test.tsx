import React from 'react';
import { UserProfile } from '../../../src/components/userprofile';
import { UserProfileProps } from '../../../src/components/userprofile/UserProfile';
import { render, screen } from '../../testUtils/testTools';

const sampleUser: UserProfileProps = {
  name: 'Steve Job',
  pronouns: 'he/him',
  schoolName: 'Apple University',
};

describe('Mock UserProfileLayout component', () => {
  it('renders sampleUser', () => {
    render(<UserProfile {...sampleUser} />);

    expect(screen.getByText('Steve Job')).toBeVisible();
    expect(screen.getByText('he/him')).toBeVisible();
    expect(screen.getByText('Apple University')).toBeVisible();
  });
});
