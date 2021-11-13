import React from 'react';
import fetchMock from 'fetch-mock-jest';
import { render, waitFor } from '../../testUtils/testTools';
import { RegistrationForm, RegistrationModal } from '../../../src/components/RegistrationModal';
import { PopUpModal } from '../../../src/components/PopupModal';
import { getMock } from '../../testUtils/getMock';

const mockProject = {
  id: '1234',
  name: 'Project A',
  description: '',
  tableNumber: undefined,
};

jest.mock('../../../src/components/PopupModal');
getMock(PopUpModal).mockImplementation(({ children }) => <>{children}</>);

jest.mock('../../../src/components/RegistrationModal/RegistrationForm');
const RegistrationFormMock = getMock(RegistrationForm).mockImplementation(() => (
  <div>Mock Form</div>
));

describe('Registration Modal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders initial values as undefined when the user has no project', async () => {
    fetchMock.getOnce('/api/project', 404);
    render(<RegistrationModal />);

    await waitFor(() => {
      expect(RegistrationFormMock).toHaveBeenCalledWith(
        expect.objectContaining({ initialValues: undefined }),
        {},
      );
    });
  });

  it('displays an error if the post call response is not 200', async () => {
    fetchMock.getOnce('/api/project', mockProject);
    render(<RegistrationModal />);

    await waitFor(() => {
      expect(RegistrationFormMock).toHaveBeenCalledWith(
        expect.objectContaining({ initialValues: mockProject }),
        {},
      );
    });
  });

  it('fetches registration when onSubmit is called for form', async () => {
    fetchMock.getOnce('/api/project', 404);
    render(<RegistrationModal />);

    await waitFor(() => {
      expect(RegistrationFormMock).toHaveBeenCalledWith(
        expect.objectContaining({ initialValues: undefined }),
        {},
      );
    });

    fetchMock.mockClear();

    RegistrationFormMock.mock.calls[0][0].onSubmit!();

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/project');
    });
  });
});
