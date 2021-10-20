import React from 'react';
import { render, screen } from '../../testUtils/testTools';
import { VideoTableRow } from '../../../src/components/Videos/VideoTableRow';
import { Video } from '../../../src/pages/app/videos';
import { Table, Tbody } from '@chakra-ui/table';
import { NavBar } from '../../../src/components/NavBar';
import { NavLink } from '../../../src/components/NavBar/NavLink';
import { NavProfileMenu } from '../../../src/components/NavBar/NavProfileMenu';
import { getMock } from '../../testUtils/getMock';

jest.mock('../../../src/components/NavBar/NavLink.tsx');
getMock(NavLink).mockImplementation(() => <p>NavLink</p>);
jest.mock('../../../src/components/NavBar/NavProfileMenu.tsx');
getMock(NavProfileMenu).mockImplementation(() => <p>NavProfileMenu</p>);

describe('NavBar', () => {
  it('renders correctly', async () => {
    expect(() => render(<NavBar />)).not.toThrowError();

    expect(NavLink).toBeCalledTimes(3);
    expect(NavProfileMenu).toBeCalledTimes(1);
  });
});
