import { useState, useEffect, useCallback, useRef } from 'react'
import { useFormStore } from '@/app/store/formStore'

export const useDebouncedComponentUpdate = (
  componentId: string,
  property: string,
  initialValue: string,
  debounceMs: number = 300
) => {
  const [localValue, setLocalValue] = useState(initialValue)
  const updateComponentProperty = useFormStore(state => state.updateComponentProperty)
  const timeoutRef = useRef<number | undefined>(undefined)

  // Update local state when initial value changes (from WebSocket)
  // But only if we're not currently typing (no pending timeout)
  useEffect(() => {
    if (!timeoutRef.current) {
      setLocalValue(initialValue)
    }
  }, [initialValue])

  // Debounced update function
  const debouncedUpdate = useCallback((value: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = window.setTimeout(() => {
      updateComponentProperty(componentId, property as any, value)
    }, debounceMs)
  }, [componentId, property, updateComponentProperty, debounceMs])

  // Handle input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    debouncedUpdate(newValue)
  }, [debouncedUpdate])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    localValue,
    handleChange
  }
}