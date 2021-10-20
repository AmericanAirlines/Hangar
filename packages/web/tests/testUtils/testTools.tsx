import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Chakra } from '../../src/components/Chakra';

const AllTheProviders: React.FC = ({ children }) => {
  return <Chakra cookies="">{children}</Chakra>;
};

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
