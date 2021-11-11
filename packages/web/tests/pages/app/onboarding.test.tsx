import userEvent from '@testing-library/user-event';
import React from 'react';
import fetchMock from 'fetch-mock-jest';
import Onboarding from '../../../src/pages/app/onboarding';
import { act, render, screen, waitFor } from '../../testUtils/testTools';

describe('/app/onboarding', () => {
  beforeEach(() => {
    delete (window as any).location;
    (window as any).location = { href: '' };
  });

  it('presents fields for the user', () => {
    render(<Onboarding />);
    expect(screen.queryByText('Welcome to Hangar', { exact: false })).toBeVisible();
    expect(screen.queryByText('we need just a little more info', { exact: false })).toBeVisible();

    const nameInputElement = screen.queryByLabelText('Name');
    expect(nameInputElement).toBeVisible();
    expect(nameInputElement).toBeEnabled();

    const emailInputElement = screen.queryByLabelText('Student Email');
    expect(emailInputElement).toBeVisible();
    expect(emailInputElement).toBeEnabled();

    const submitButton = screen.getByText('Submit');
    expect(submitButton).toBeVisible();
    expect(submitButton).toBeEnabled();
  });

  it('hits the api and redirects on submit', async () => {
    render(<Onboarding />);

    const nameInputElement = screen.getByLabelText('Name');
    const emailInputElement = screen.getByLabelText('Student Email');
    const submitButton = screen.getByText('Submit');

    const name = 'Jon Snow';
    const email = 'jon.snow@winterfell.edu';

    userEvent.type(nameInputElement, name);
    userEvent.type(emailInputElement, email);

    fetchMock.postOnce('/api/onboarding', 200);
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(fetchMock).toHaveLastFetched(
        '/api/onboarding',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({ name, email }),
        }),
      );
      expect(window.location.href).toEqual('/app');
    });
  });

  it('displays validation errors', async () => {
    render(<Onboarding />);

    const emailInputElement = screen.queryByLabelText('Student Email');
    expect(emailInputElement).toBeVisible();
    expect(emailInputElement).toBeEnabled();

    const submitButton = screen.getByText('Submit');

    act(() => {
      submitButton.click();
    });

    await waitFor(() => {
      expect(screen.queryByText('Name is required', { exact: false })).toBeVisible();
      expect(screen.queryByText('Student email is required', { exact: false })).toBeVisible();
    });
  });

  it('displays an error when the backend has an issue', async () => {
    render(<Onboarding />);
    const nameInputElement = screen.getByLabelText('Name');
    const emailInputElement = screen.getByLabelText('Student Email');
    const submitButton = screen.getByText('Submit');

    const name = 'Jon Snow';
    const email = 'jon.snow@winterfell.edu';

    userEvent.type(nameInputElement, name);
    userEvent.type(emailInputElement, email);

    const errorText = 'Ohhhhh noooo!';
    fetchMock.postOnce('/api/onboarding', { status: 500, body: errorText });
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(fetchMock).toHaveLastFetched(
        '/api/onboarding',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({ name, email }),
        }),
      );
      expect(window.location.href).toEqual('');
      expect(screen.queryByText(errorText)).toBeVisible();
    });
  });
});
