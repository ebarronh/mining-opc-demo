'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for debouncing values
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for debounced search functionality
 * @param initialValue - Initial search value
 * @param delay - Debounce delay in milliseconds
 * @param minLength - Minimum length before triggering search
 * @returns Object with search value, debounced value, and handlers
 */
export function useDebouncedSearch(
  initialValue: string = '',
  delay: number = 300,
  minLength: number = 0
) {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchValue = useDebounce(searchValue, delay);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Track if search is actively being debounced
  useEffect(() => {
    if (searchValue !== debouncedSearchValue) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [searchValue, debouncedSearchValue]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    setIsSearching(true);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchValue('');
    setIsSearching(false);
  }, []);

  // Only return debounced value if it meets minimum length requirement
  const effectiveSearchValue = debouncedSearchValue.length >= minLength ? debouncedSearchValue : '';

  return {
    searchValue,
    debouncedSearchValue: effectiveSearchValue,
    isSearching,
    handleSearchChange,
    clearSearch,
    hasActiveSearch: effectiveSearchValue.length > 0
  };
}

/**
 * Custom hook for debounced API calls
 * @param apiCall - Function that makes the API call
 * @param delay - Debounce delay in milliseconds
 * @returns Object with call function and loading state
 */
export function useDebouncedApiCall<T extends any[], R>(
  apiCall: (...args: T) => Promise<R>,
  delay: number = 500
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<R | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const currentRequestRef = useRef<number>(0);

  const debouncedCall = useCallback((...args: T) => {
    return new Promise<R>((resolve, reject) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set loading state immediately for user feedback
      setIsLoading(true);
      setError(null);

      // Create new timeout
      timeoutRef.current = setTimeout(async () => {
        const requestId = ++currentRequestRef.current;
        
        try {
          const response = await apiCall(...args);
          
          // Only update state if this is still the latest request
          if (requestId === currentRequestRef.current) {
            setResult(response);
            setIsLoading(false);
            resolve(response);
          }
        } catch (err) {
          // Only update state if this is still the latest request
          if (requestId === currentRequestRef.current) {
            const error = err instanceof Error ? err : new Error('An error occurred');
            setError(error);
            setIsLoading(false);
            reject(error);
          }
        }
      }, delay);
    });
  }, [apiCall, delay]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    setIsLoading(false);
    currentRequestRef.current++;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    call: debouncedCall,
    cancel,
    isLoading,
    error,
    result
  };
}

/**
 * Custom hook for debounced form field validation
 * @param validator - Function that validates the value
 * @param delay - Debounce delay in milliseconds
 * @returns Object with validation state and handlers
 */
export function useDebouncedValidation<T>(
  validator: (value: T) => string | null,
  delay: number = 300
) {
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const debouncedValue = useDebounce(value, delay);

  useEffect(() => {
    if (debouncedValue !== null) {
      setIsValidating(false);
      const validationError = validator(debouncedValue);
      setError(validationError);
    }
  }, [debouncedValue, validator]);

  const validate = useCallback((newValue: T) => {
    setValue(newValue);
    setIsValidating(true);
    setError(null);
  }, []);

  const clearValidation = useCallback(() => {
    setValue(null);
    setError(null);
    setIsValidating(false);
  }, []);

  return {
    validate,
    clearValidation,
    error,
    isValidating,
    isValid: error === null && value !== null
  };
}