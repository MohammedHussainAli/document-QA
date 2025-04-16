import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => '',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/font/google
jest.mock('next/font/google', () => ({
  Geist: () => ({
    className: 'geist',
    variable: '--font-geist-sans',
  }),
  Geist_Mono: () => ({
    className: 'geist-mono',
    variable: '--font-geist-mono',
  }),
}));

// Extend expect with custom matchers
expect.extend({
  toHaveBeenCalledWithMatch: (received: jest.Mock, expected: any) => {
    const calls = received.mock.calls;
    const match = calls.some(call =>
      JSON.stringify(call[0]).includes(JSON.stringify(expected))
    );

    return {
      pass: match,
      message: () =>
        `Expected ${received.getMockName()} to have been called with arguments matching ${JSON.stringify(expected)}`,
    };
  },
});