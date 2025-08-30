"use client"

import { useState, useEffect } from "react"

/**
 * EDUCATIONAL NOTE: Custom Debounce Hook
 *
 * This hook demonstrates:
 * 1. Custom hook creation for reusable logic
 * 2. Performance optimization by debouncing rapid state changes
 * 3. Cleanup with useEffect return function
 * 4. Generic TypeScript implementation
 *
 * Debouncing prevents excessive API calls or expensive operations
 * by waiting for a pause in user input before executing the callback.
 */

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup function: cancel the timeout if value changes before delay
    // This is crucial for preventing memory leaks and unnecessary updates
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay]) // Re-run effect when value or delay changes

  return debouncedValue
}

/**
 * EDUCATIONAL NOTE: Usage Example
 *
 * const [searchTerm, setSearchTerm] = useState('')
 * const debouncedSearchTerm = useDebounce(searchTerm, 300)
 *
 * useEffect(() => {
 *   // This will only run 300ms after the user stops typing
 *   performSearch(debouncedSearchTerm)
 * }, [debouncedSearchTerm])
 */
