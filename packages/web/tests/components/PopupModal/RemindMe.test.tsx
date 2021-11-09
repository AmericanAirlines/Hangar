import React from 'react';
import userEvent from '@testing-library/user-event';
import fetchMock from 'fetch-mock';
import { render, screen, waitFor } from '../../testUtils/testTools';
import { RemindMeModal } from '../../../src/components/PopupModal/RemindModal';

describe('Popup Modal', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('renders correctly', async () => {
    render(<RemindMeModal />);

    const openModalButton = screen.getByText('Remind Me');
    expect(openModalButton).toBeVisible();
    userEvent.click(openModalButton);

    await waitFor(() => {
      expect(screen.queryByText('Confirm')).toBeVisible();
    });

    fetchMock.postOnce('/api/subscription/subscribe', { res: { ok: true } });

    const confirmActionButton = screen.getByText('Confirm');
    userEvent.click(confirmActionButton);

    await waitFor(() => {
      expect(screen.queryByText('Close')).toBeVisible();
      expect(screen.queryByText('Success', { exact: false })).toBeVisible();
    });
  });

  it('displays an error if the post call response is not 200', async () => {
    render(<RemindMeModal />);

    const openModalButton = screen.getByText('Remind Me');
    expect(openModalButton).toBeVisible();
    userEvent.click(openModalButton);

    await waitFor(() => {
      expect(screen.queryByText('Confirm')).toBeVisible();
    });

    fetchMock.postOnce('/api/subscription/subscribe', 500);

    const confirmActionButton = screen.getByText('Confirm');
    userEvent.click(confirmActionButton);

    await waitFor(() => {
      expect(screen.queryByText('Close')).toBeVisible();
      expect(screen.queryByText('An Error Occurred')).toBeVisible();
    });
  });
});
