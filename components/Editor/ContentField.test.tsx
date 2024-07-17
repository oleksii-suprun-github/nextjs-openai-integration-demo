import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Content from '@/components/Editor/ContentField';

// Mock the Alert and Loading components
vi.mock('@/ui-lib', () => ({
  Alert: ({ type, children }: any) => <div data-testid={`alert-${type}`}>{children}</div>,
  Loading: ({ customClasses }: any) => <div data-testid="loading" className={customClasses}></div>,
}));

describe('Content', () => {
  const mockSetContentValue = vi.fn();
  const mockEntryCreatedRef = { current: false };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const { container } = render(
      <Content
        isLoading={false}
        contentValue=""
        setContentValue={mockSetContentValue}
        entryCreatedRef={mockEntryCreatedRef}
        isPromptSymbolsExceeded={false}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('displays error alert when prompt symbols limit is exceeded', () => {
    render(
      <Content
        isLoading={false}
        contentValue="Some content"
        setContentValue={mockSetContentValue}
        entryCreatedRef={mockEntryCreatedRef}
        isPromptSymbolsExceeded={true}
      />,
    );

    expect(screen.getByTestId('alert-error')).toHaveTextContent(
      'You have reached the 10,000 symbol limit and cannot make new requests.',
    );
  });

  it('displays warning alert when content is too short', () => {
    render(
      <Content
        isLoading={false}
        contentValue="Short"
        setContentValue={mockSetContentValue}
        entryCreatedRef={mockEntryCreatedRef}
        isPromptSymbolsExceeded={false}
      />,
    );

    expect(screen.getByTestId('alert-warning')).toHaveTextContent(
      'Please enter at least 30 characters. Changes are not saved for entries with fewer than 30 characters.',
    );
  });

  it('displays success alert when a new note is created', () => {
    mockEntryCreatedRef.current = true;

    render(
      <Content
        isLoading={false}
        contentValue="Some content"
        setContentValue={mockSetContentValue}
        entryCreatedRef={mockEntryCreatedRef}
        isPromptSymbolsExceeded={false}
      />,
    );

    expect(screen.getByTestId('alert-success')).toHaveTextContent(
      'A new note was created. Redirecting....',
    );
  });

  it('displays loading spinner when loading', () => {
    render(
      <Content
        isLoading={true}
        contentValue="Some content"
        setContentValue={mockSetContentValue}
        entryCreatedRef={mockEntryCreatedRef}
        isPromptSymbolsExceeded={false}
      />,
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('does not update content value when prompt symbols limit is exceeded', () => {
    render(
      <Content
        isLoading={false}
        contentValue="Initial content"
        setContentValue={mockSetContentValue}
        entryCreatedRef={mockEntryCreatedRef}
        isPromptSymbolsExceeded={true}
      />,
    );

    const textarea = screen.getByPlaceholderText('Please write your thoughts here...');
    fireEvent.change(textarea, { target: { value: 'New content' } });

    expect(textarea).toHaveValue('Initial content');
    expect(mockSetContentValue).not.toHaveBeenCalledWith('New content');
  });

  it('does not update content value when loading', () => {
    render(
      <Content
        isLoading={true}
        contentValue="Initial content"
        setContentValue={mockSetContentValue}
        entryCreatedRef={mockEntryCreatedRef}
        isPromptSymbolsExceeded={false}
      />,
    );

    const textarea = screen.getByPlaceholderText('Please write your thoughts here...');
    fireEvent.change(textarea, { target: { value: 'New content' } });

    expect(textarea).toHaveValue('Initial content');
    expect(mockSetContentValue).not.toHaveBeenCalledWith('New content');
  });
});