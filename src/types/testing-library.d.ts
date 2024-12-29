import '@testing-library/jest-dom';
import { waitFor } from '@testing-library/react';

declare module '@testing-library/react' {
  export const waitFor: typeof waitFor & jest.Mock;
}
