import React from 'react';
import fetchMock from 'fetch-mock';
import { render } from '../../testUtils/testTools';
import { RemindMeModal } from '../../../src/components/RemindMeModal';
import { PopUpModal } from '../../../src/components/PopupModal';
import { getMock } from '../../testUtils/getMock';

jest.mock('../../../src/components/PopupModal');

const mockPopupModal = getMock(PopUpModal).mockImplementation(() => <div>Mock Popup Modal</div>);

describe('Remind Me Modal', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('renders correctly', async () => {
    render(<RemindMeModal />);
    fetchMock.postOnce('/api/subscription/subscribe', 200);

    await expect(mockPopupModal.mock.calls[0][0].onConfirm!()).resolves.toBeUndefined();
  });

  it('displays an error if the post call response is not 200', async () => {
    render(<RemindMeModal />);

    fetchMock.postOnce('/api/subscription/subscribe', 500);
    await expect(mockPopupModal.mock.calls[0][0].onConfirm!()).rejects.toThrowError();
  });
});
