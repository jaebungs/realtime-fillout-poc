import { FormComponent } from '../types/componentTypes'

export interface Operation {
  id: string
  type: 'add' | 'addAtPosition' | 'remove' | 'move' | 'update'
  userId: string
  timestamp: number
  // Operation-specific data
  componentName?: string
  componentId?: string
  order?: number
  draggedComponent?: FormComponent
  dropTargetComponent?: FormComponent
  property?: string
  value?: any
  targetComponent?: FormComponent
}

export interface OperationState {
  operations: Operation[]
  sequenceNumber: number
}

export interface TransformResult {
  operation: Operation | null
  shouldApply: boolean
}