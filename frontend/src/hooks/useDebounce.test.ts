import { renderHook, act, waitFor } from '@testing-library/react';
import { useDebounce, useDebouncedSearch, useDebouncedApiCall } from './useDebounce';

// Mock timers
jest.useFakeTimers();

describe('useDebounce', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  test('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  test('debounces value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Update value
    rerender({ value: 'updated', delay: 500 });
    expect(result.current).toBe('initial'); // Should still be initial

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current).toBe('updated');
    });
  });

  test('cancels previous timeout when value changes rapidly', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    );

    // Rapid changes
    rerender({ value: 'first' });
    act(() => {
      jest.advanceTimersByTime(200);
    });

    rerender({ value: 'second' });
    act(() => {
      jest.advanceTimersByTime(200);
    });

    rerender({ value: 'final' });
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current).toBe('final');
    });
  });
});

describe('useDebouncedSearch', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  test('initializes with correct default values', () => {
    const { result } = renderHook(() => useDebouncedSearch());

    expect(result.current.searchValue).toBe('');
    expect(result.current.debouncedSearchValue).toBe('');
    expect(result.current.isSearching).toBe(false);
    expect(result.current.hasActiveSearch).toBe(false);
  });

  test('handles search value changes', () => {
    const { result } = renderHook(() => useDebouncedSearch('', 300, 2));

    act(() => {
      result.current.handleSearchChange('test');
    });

    expect(result.current.searchValue).toBe('test');
    expect(result.current.isSearching).toBe(true);
  });

  test('respects minimum length requirement', async () => {
    const { result } = renderHook(() => useDebouncedSearch('', 300, 3));

    act(() => {
      result.current.handleSearchChange('ab'); // Below minimum
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.debouncedSearchValue).toBe(''); // Should be empty due to min length
    });

    act(() => {
      result.current.handleSearchChange('abc'); // Meets minimum
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.debouncedSearchValue).toBe('abc');
    });
  });

  test('clears search correctly', () => {
    const { result } = renderHook(() => useDebouncedSearch('initial'));

    act(() => {
      result.current.handleSearchChange('search term');
    });

    expect(result.current.searchValue).toBe('search term');

    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.searchValue).toBe('');
    expect(result.current.isSearching).toBe(false);
  });
});

describe('useDebouncedApiCall', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  test('initializes with correct default state', () => {
    const mockApiCall = jest.fn().mockResolvedValue('success');
    const { result } = renderHook(() => useDebouncedApiCall(mockApiCall, 500));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.result).toBe(null);
  });

  test('debounces API calls', async () => {
    const mockApiCall = jest.fn().mockResolvedValue('success');
    const { result } = renderHook(() => useDebouncedApiCall(mockApiCall, 500));

    // Make multiple rapid calls
    act(() => {
      result.current.call('arg1');
    });
    act(() => {
      result.current.call('arg2');
    });
    act(() => {
      result.current.call('arg3');
    });

    expect(result.current.isLoading).toBe(true);
    expect(mockApiCall).not.toHaveBeenCalled(); // Should be debounced

    // Advance time to trigger the call
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(mockApiCall).toHaveBeenCalledWith('arg3'); // Only the last call
      expect(mockApiCall).toHaveBeenCalledTimes(1);
    });
  });

  test('handles API call success', async () => {
    const mockApiCall = jest.fn().mockResolvedValue('success response');
    const { result } = renderHook(() => useDebouncedApiCall(mockApiCall, 500));

    act(() => {
      result.current.call('test');
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.result).toBe('success response');
      expect(result.current.error).toBe(null);
    });
  });

  test('handles API call errors', async () => {
    const mockError = new Error('API Error');
    const mockApiCall = jest.fn().mockRejectedValue(mockError);
    const { result } = renderHook(() => useDebouncedApiCall(mockApiCall, 500));

    act(() => {
      result.current.call('test');
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError);
      expect(result.current.result).toBe(null);
    });
  });

  test('cancels pending calls', () => {
    const mockApiCall = jest.fn().mockResolvedValue('success');
    const { result } = renderHook(() => useDebouncedApiCall(mockApiCall, 500));

    act(() => {
      result.current.call('test');
    });

    expect(result.current.isLoading).toBe(true);

    act(() => {
      result.current.cancel();
    });

    expect(result.current.isLoading).toBe(false);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockApiCall).not.toHaveBeenCalled();
  });

  test('ignores outdated responses', async () => {
    let resolveFirst: (value: string) => void;
    let resolveSecond: (value: string) => void;

    const firstCall = new Promise<string>((resolve) => {
      resolveFirst = resolve;
    });
    const secondCall = new Promise<string>((resolve) => {
      resolveSecond = resolve;
    });

    const mockApiCall = jest.fn()
      .mockReturnValueOnce(firstCall)
      .mockReturnValueOnce(secondCall);

    const { result } = renderHook(() => useDebouncedApiCall(mockApiCall, 100));

    // First call
    act(() => {
      result.current.call('first');
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Second call (should cancel first)
    act(() => {
      result.current.call('second');
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Resolve first call (should be ignored)
    act(() => {
      resolveFirst('first result');
    });

    // Resolve second call (should be used)
    await act(async () => {
      resolveSecond('second result');
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(result.current.result).toBe('second result');
    });
  });
});