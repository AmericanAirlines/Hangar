import React from 'react';
import fetchMock from 'fetch-mock-jest';
import { render, screen, act } from '../../testUtils/testTools';
import Videos from '../../../src/pages/app/videos';
import { Video } from '../../../src/pages/app/videos';
import { getMock } from '../../testUtils/getMock';
import { AppLayout } from '../../../src/components/Layout';
import { VideoTableRow } from '../../../src/components/Videos';

jest.mock('../../../src/components/Layout/AppLayout.tsx');
getMock(AppLayout).mockImplementation(({ children }) => <>{children}</>);
jest.mock('../../../src/components/Videos/VideoTableRow.tsx');
getMock(VideoTableRow).mockImplementation(({ video }) => (
  <tr>
    <td>Video Row</td>
  </tr>
));

// Mock api response objetcs for /api/videos
const video1: Video = {
  id: '1',
  title: 'video1',
  durationInSeconds: 102,
  url: 'www.test.org',
};
const video2: Video = {
  id: '2',
  title: 'video2',
  durationInSeconds: 1109,
  url: 'www.test2.org',
};

// Wait utility
const wait = () => new Promise<void>((resolve) => setTimeout(() => resolve(), 0));

describe('videos page', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    fetchMock.reset();
  });

  it('renders', async () => {
    fetchMock.get('/api/videos', []);

    expect(() => render(<Videos />)).not.toThrow();

    // Wait for fetch
    await act(wait);

    expect(screen.getByText('Videos')).toBeVisible();
  });

  it('renders the table properly when no videos are returned', async () => {
    fetchMock.get('/api/videos', []);

    expect(() => render(<Videos />)).not.toThrow();

    // Wait for fetch
    await act(wait);

    expect(screen.getByText('Videos')).toBeVisible();

    expect(VideoTableRow).toBeCalledTimes(0);
    expect(screen.getByText('No Videos Found')).toBeVisible();
  });

  it('renders the table properly when videos are returned', async () => {
    fetchMock.get('/api/videos', [video1, video2]);

    expect(() => render(<Videos />)).not.toThrow();

    // Wait for fetch
    await act(wait);

    expect(screen.getByText('Title')).toBeVisible();
    expect(screen.getByText('Duration')).toBeVisible();

    expect(screen.getAllByText('Video Row').length).toEqual(2);
  });
});
