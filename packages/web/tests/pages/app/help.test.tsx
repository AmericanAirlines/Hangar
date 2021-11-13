import React from 'react';
import { render } from '../../testUtils/testTools';
import HelpPage from '../../../src/pages/app/help';
import { getMock } from '../../testUtils/getMock';
import { AppLayout } from '../../../src/components/Layout';

jest.mock('../../../src/components/Layout/AppLayout.tsx');
getMock(AppLayout).mockImplementation(({ children }) => <>{children}</>);

describe('web /app/help', () => {
  it('renders', async () => {
    expect(() => render(<HelpPage />)).not.toThrow();
  });
});
