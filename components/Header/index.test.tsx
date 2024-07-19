import { describe, it, expect, vi, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { createTranslator, useTranslations } from 'next-intl';
import Header from './';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

describe('Header', () => {
  beforeAll(async () => {
    const translate = createTranslator({
      locale: 'en',
      namespace: 'Header',
      messages: (await import('@/messages/en.json')).default,
    });

    (useTranslations as Mock).mockImplementation(() => translate);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders navigation links correctly', () => {
    (usePathname as Mock).mockReturnValue('/journal');
    const { container } = render(
      <Header
        userPromptLimit="1000"
        userPromptUsed="500"
        userPromptLimitRenewal={'2022-01-01T00:00:00.000Z'}
      />,
    );
    expect(container).toMatchSnapshot();

    expect(screen.getByText('Journal')).toBeInTheDocument();
    expect(screen.getByText('Statistics')).toBeInTheDocument();
  });

  it('applies active class to the current path link', () => {
    (usePathname as Mock).mockReturnValue('/journal');
    render(
      <Header
        userPromptLimit="1000"
        userPromptUsed="500"
        userPromptLimitRenewal={'2022-01-01T00:00:00.000Z'}
      />,
    );

    expect(screen.getByRole('link', { name: 'Journal' })).toHaveClass('font-bold');
    expect(screen.getByRole('link', { name: 'Statistics' })).not.toHaveClass('font-bold');
  });

  it('displays the correct prompt usage', () => {
    (usePathname as Mock).mockReturnValue('/journal');
    render(
      <Header
        userPromptLimit="1000"
        userPromptUsed="500"
        userPromptLimitRenewal={'2022-01-01T00:00:00.000Z'}
      />,
    );

    expect(screen.getByText('500 / 1000')).toBeInTheDocument();
    expect(screen.getByText('prompt symbols remaining', { exact: false })).toBeInTheDocument();
  });
});
