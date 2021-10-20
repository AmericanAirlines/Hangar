import React from 'react';
import { render, screen, act } from '../../../testUtils/testTools';
import UserProfilePage from '../../../../src/pages/user/[uid]';
import fetchMock from 'fetch-mock-jest';
import { UserProfile, UserProfileProps } from '../../../../src/components/userprofile/UserProfile';
import { getMock } from '../../../testUtils/getMock';

jest.mock('../../../../src/components/userprofile/UserProfile');
getMock(UserProfile).mockImplementation(({ ...UserProfileData }) => (
  <div>{UserProfileData.name}</div>
));

jest.mock('next/router', () => ({
  useRouter() {
    return {
      query: '',
    };
  },
}));

const useRouter = jest.spyOn(require('next/router'), 'useRouter');

const sampleUser: UserProfileProps = {
  name: 'Steve Job',
  pronouns: 'he/him',
  schoolName: 'Apple University',
};

const wait = () => new Promise<void>((resolve) => setTimeout(() => resolve(), 0));

describe('web /user/', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('outputs error given non-numeric or no uid', async () => {
    useRouter.mockImplementation(() => ({
      query: { uid: 'abc' },
    }));
    expect(() => render(<UserProfilePage />)).not.toThrow();

    await act(wait);
    expect(screen.getByText('User id malformed'));
  });

  it('outputs error given non-existant user id', async () => {
    useRouter.mockImplementation(() => ({
      query: { uid: '0' },
    }));
    expect(() => render(<UserProfilePage />)).not.toThrow();

    await act(wait);
    expect(screen.getByText('User could not be found'));
  });

  it('outputs user profile info given valid user id', async () => {
    useRouter.mockImplementation(() => ({
      query: { uid: '0' },
    }));

    fetchMock.get('/api/users/0', sampleUser);

    expect(() => render(<UserProfilePage />)).not.toThrow();

    await act(wait);

    expect(UserProfile).toBeCalledTimes(1);
    expect(screen.getByText('Steve Job')).toBeVisible();
  });
});
