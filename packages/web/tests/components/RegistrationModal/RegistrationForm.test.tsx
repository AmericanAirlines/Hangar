import React from 'react';
import fetchMock from 'fetch-mock-jest';
import userEvent from '@testing-library/user-event';
import { render, waitFor, screen } from '../../testUtils/testTools';
import { RegistrationForm } from '../../../src/components/ProjectRegistrationModal';

const mockProject = {
  name: 'A Project Name',
  description: 'A project that does stuff',
  tableNumber: '1',
};

describe('Registration Form', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    fetchMock.mockReset();
  });

  it('renders correctly', async () => {
    fetchMock.getOnce('/api/project/', mockProject);
    const { getByDisplayValue } = render(<RegistrationForm initialValues={mockProject} />);

    await waitFor(() => {
      expect(getByDisplayValue(mockProject.name)).toBeVisible();
      expect(getByDisplayValue(mockProject.description)).toBeVisible();
      expect(getByDisplayValue(mockProject.tableNumber)).toBeVisible();
    });
  });

  it('submits form with correct values', async () => {
    fetchMock.postOnce('/api/projects/', 200);
    render(<RegistrationForm initialValues={mockProject} />);
    userEvent.type(screen.getByLabelText(/name/i), 'A new name');
    userEvent.type(screen.getByLabelText(/description/i), 'A new description');
    userEvent.type(screen.getByLabelText(/table number/i), '1');

    userEvent.click(screen.getByText('Submit'));

    await waitFor(() =>
      expect(fetchMock).toHaveFetched('/api/projects/', {
        body: { name: 'A new name', description: 'A new description', tableNumber: '1' },
      }),
    );
  });

  it('displays an error if the registration call fails', async () => {
    fetchMock.postOnce('/api/projects/', 500);
    const { getByLabelText, getByRole, queryByText } = render(
      <RegistrationForm initialValues={mockProject} />,
    );
    userEvent.type(getByLabelText(/name/i), 'A new name');
    userEvent.type(getByLabelText(/description/i), 'A new description');
    userEvent.type(getByLabelText(/table number/i), '1');

    userEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() =>
      expect(queryByText('Something went wrong', { exact: false })).toBeVisible(),
    );
  });

  it('defaults the fields to empty string when the initial project pull fails', async () => {
    const { getByLabelText } = render(<RegistrationForm />);

    await waitFor(() => {
      expect(getByLabelText(/name/i)).toHaveTextContent('');
      expect(getByLabelText(/description/i)).toHaveTextContent('');
      expect(getByLabelText(/table number/i)).toHaveTextContent('');
    });
  });

  it('removes the server error when the user clicks the close button', async () => {
    fetchMock.postOnce('/api/projects/', 500);
    const { getByLabelText, getByRole, queryByText, getByTestId } = render(
      <RegistrationForm initialValues={mockProject} />,
    );
    userEvent.type(getByLabelText(/name/i), 'A new name');
    userEvent.type(getByLabelText(/description/i), 'A new description');
    userEvent.type(getByLabelText(/table number/i), '1');

    userEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() =>
      expect(queryByText('Something went wrong', { exact: false })).toBeVisible(),
    );

    const closeButton = getByTestId('alert-close-button');

    userEvent.click(closeButton);

    await waitFor(() => expect(queryByText('Something went wrong', { exact: false })).toBeNull());
  });
});
