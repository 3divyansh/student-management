"use client"

import { useState, useCallback } from "react"

/**
 * EDUCATIONAL NOTE: Local Storage Hook
 *
 * This custom hook demonstrates:
 * 1. Persistent state management with localStorage
 * 2. Error handling for storage operations
 * 3. SSR compatibility (server-side rendering)
 * 4. Type safety with generics
 * 5. Synchronization between multiple components
 */

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Check if we're in the browser (not SSR)
      if (typeof window === "undefined") {
        return initialValue
      }

      // Get from local storage by key
      const item = window.localStorage.getItem(key)

      // Parse stored json or return initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // If error, return initial value
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value

        // Save state
        setStoredValue(valueToStore)

        // Save to local storage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue],
  )

  // Function to remove the item from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}
