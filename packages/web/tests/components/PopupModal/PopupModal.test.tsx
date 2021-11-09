import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '../../testUtils/testTools';
import { PopUpModal } from '../../../src/components/PopupModal';

describe('Popup Modal', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  const headerText = 'Test Header';
  const bodyText = 'Test Body';
  const openModalText = 'Click Me';
  const errorMessage = 'Oops... I broke something';
  const succussMessage = 'Succuss!!! We have working code!';
  const mockConfirmationAction = jest.fn();

  it('renders correctly', async () => {
    render(
      <PopUpModal openModalText={openModalText} header={headerText}>
        {bodyText}
      </PopUpModal>,
    );

    const openModalButton = screen.getByText(openModalText);
    expect(openModalButton).toBeVisible();
    userEvent.click(openModalButton);

    await waitFor(() => {
      expect(screen.queryByText('Close')).toBeVisible();
      expect(screen.queryByText(headerText)).toBeVisible();
      expect(screen.queryByText(bodyText)).toBeVisible();
    });

    const closeModalButton = screen.getByText('Close');
    userEvent.click(closeModalButton);

    await waitFor(() => {
      expect(screen.queryByText('Close')).not.toBeVisible();
      expect(screen.queryByText(headerText)).not.toBeVisible();
      expect(screen.queryByText(bodyText)).not.toBeVisible();
    });
  });

  it('triggers an event when the confirm button is pressed and changes its text to success message', async () => {
    render(
      <PopUpModal
        openModalText={openModalText}
        header={headerText}
        errorMessage={errorMessage}
        succussMessage={succussMessage}
        onConfirm={mockConfirmationAction}
      >
        {bodyText}
      </PopUpModal>,
    );

    const openModalButton = screen.getByText(openModalText);
    expect(openModalButton).toBeVisible();
    userEvent.click(openModalButton);

    await waitFor(() => {
      expect(screen.queryByText('Confirm')).toBeVisible();
    });

    const confirmActionButton = screen.getByText('Confirm');
    userEvent.click(confirmActionButton);

    await waitFor(() => {
      expect(mockConfirmationAction).toBeCalledTimes(1);
      expect(screen.queryByText('Close')).toBeVisible();
      expect(screen.queryByText('Success', { exact: false })).toBeVisible();
      expect(screen.queryByText(succussMessage)).toBeVisible();
    });
  });

  it('displays an error message if something occurs when performing confirmation action', async () => {
    render(
      <PopUpModal
        openModalText={openModalText}
        header={headerText}
        errorMessage={errorMessage}
        succussMessage={succussMessage}
        onConfirm={mockConfirmationAction}
      >
        {bodyText}
      </PopUpModal>,
    );

    const openModalButton = screen.getByText(openModalText);
    expect(openModalButton).toBeVisible();
    userEvent.click(openModalButton);

    await waitFor(() => {
      expect(screen.queryByText('Confirm')).toBeVisible();
    });

    mockConfirmationAction.mockRejectedValueOnce('Something went wrong');
    const confirmActionButton = screen.getByText('Confirm');
    userEvent.click(confirmActionButton);

    await waitFor(() => {
      expect(mockConfirmationAction).toBeCalledTimes(1);
      expect(screen.queryByText('Close')).toBeVisible();
      expect(screen.queryByText('Uh oh', { exact: false })).toBeVisible();
      expect(screen.queryByText(errorMessage)).toBeVisible();
    });
  });

  it('does not display a success message if one is not provided', async () => {
    render(
      <PopUpModal
        openModalText={openModalText}
        header={headerText}
        errorMessage={errorMessage}
        onConfirm={mockConfirmationAction}
      >
        {bodyText}
      </PopUpModal>,
    );

    const openModalButton = screen.getByText(openModalText);
    expect(openModalButton).toBeVisible();
    userEvent.click(openModalButton);

    await waitFor(() => {
      expect(screen.queryByText('Confirm')).toBeVisible();
    });

    userEvent.click(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(screen.queryByText('Success', { exact: false })).toBe(null);
      expect(screen.queryByText(succussMessage)).toBe(null);
    });
  });

  it('does not display confirm button if onConfirm is not provided', async () => {
    render(
      <PopUpModal
        openModalText={openModalText}
        header={headerText}
        errorMessage={errorMessage}
        succussMessage={succussMessage}
      >
        {bodyText}
      </PopUpModal>,
    );

    const openModalButton = screen.getByText(openModalText);
    expect(openModalButton).toBeVisible();
    userEvent.click(openModalButton);

    await waitFor(() => {
      expect(screen.queryByText('Confirm')).toBe(null);
    });
  });

  it('displays an error message if something occurs when performing confirmation action', async () => {
    render(
      <PopUpModal
        openModalText={openModalText}
        header={headerText}
        succussMessage={succussMessage}
        onConfirm={mockConfirmationAction}
      >
        {bodyText}
      </PopUpModal>,
    );

    const openModalButton = screen.getByText(openModalText);
    expect(openModalButton).toBeVisible();
    userEvent.click(openModalButton);

    await waitFor(() => {
      expect(screen.queryByText('Confirm')).toBeVisible();
    });

    mockConfirmationAction.mockRejectedValueOnce('Something went wrong');
    userEvent.click(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(screen.queryByText('An Error Occurred', { exact: false })).toBe(null);
      expect(screen.queryByText(errorMessage)).toBe(null);
    });
  });
});
