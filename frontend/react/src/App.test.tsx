// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { it, describe, expect } from 'vitest';

/**
* @vitest-environment jsdom
*/
describe('app', () => {
  it('renders hello world', () => {
    render(<App />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
  })

  it('clicks the link', async () => {
    render(<App />);
    const linkElement = screen.getByText(/learn react/i);
    await userEvent.click(linkElement);
  })
});
