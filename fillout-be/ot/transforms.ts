import { Operation } from './types'

export function transformOperation(op1: Operation, op2: Operation): Operation | null {
  // Operations from the same user don't need transformation
  if (op1.userId === op2.userId) return op2
  
  switch (op1.type) {
    case 'add':
      switch (op2.type) {
        case 'add':
        case 'addAtPosition':
          return transformAddVsAdd(op1, op2)
        default:
          return op2
      }
    
    case 'addAtPosition':
      switch (op2.type) {
        case 'add':
        case 'addAtPosition':
          return transformAddVsAdd(op1, op2)
        case 'remove':
          return transformAddVsRemove(op1, op2)
        default:
          return op2
      }
    
    case 'remove':
      switch (op2.type) {
        case 'add':
        case 'addAtPosition':
          return transformRemoveVsAdd(op1, op2)
        case 'remove':
          return transformRemoveVsRemove(op1, op2)
        case 'update':
          return transformUpdateVsRemove(op1, op2)
        default:
          return op2
      }
    
    case 'move':
      switch (op2.type) {
        case 'add':
        case 'addAtPosition':
          return transformMoveVsAdd(op1, op2)
        case 'remove':
          return transformMoveVsRemove(op1, op2)
        default:
          return op2
      }
    
    case 'update':
      // WIP
      return op2
    
    default:
      return op2
  }
}

export function transformAddVsAdd(op1: Operation, op2: Operation): Operation {
  // If both operations add at the same or later position, adjust the second one
  if (op2.order !== undefined && op1.order !== undefined && op2.order >= op1.order) {
    return { ...op2, order: op2.order + 1 }
  }
  return op2
}

export function transformAddVsRemove(op1: Operation, op2: Operation): Operation {
  // If removing before the add position, adjust add position down
  if (op2.order !== undefined && op1.targetComponent?.order !== undefined && 
      op2.order > op1.targetComponent.order) {
    return { ...op2, order: op2.order - 1 }
  }
  return op2
}

export function transformRemoveVsAdd(op1: Operation, op2: Operation): Operation {
  // If adding at or after remove position, adjust add position up
  if (op2.order !== undefined && op1.order !== undefined && op2.order >= op1.order) {
    return { ...op2, order: op2.order + 1 }
  }
  return op2
}

export function transformRemoveVsRemove(op1: Operation, op2: Operation): Operation | null {
  // If removing the same component, second operation becomes no-op
  if (op1.targetComponent?.id === op2.targetComponent?.id) {
    return null
  }
  
  // If removing a component that comes after the first removal, adjust position
  if (op1.targetComponent?.order !== undefined && op2.targetComponent?.order !== undefined &&
      op2.targetComponent.order > op1.targetComponent.order) {
    return {
      ...op2,
      targetComponent: {
        ...op2.targetComponent,
        order: op2.targetComponent.order - 1
      }
    }
  }
  return op2
}

export function transformMoveVsAdd(op1: Operation, op2: Operation): Operation {
  if (op2.order === undefined || !op1.draggedComponent || !op1.dropTargetComponent) return op2
  
  const dragIndex = op1.draggedComponent.order
  const dropIndex = op1.dropTargetComponent.order
  
  // Adjust add position based on move operation
  if (op2.order >= Math.min(dragIndex, dropIndex) && op2.order <= Math.max(dragIndex, dropIndex)) {
    // Add position is within the moved range, needs adjustment
    if (dragIndex < dropIndex) {
      return { ...op2, order: op2.order - 1 }
    } else {
      return { ...op2, order: op2.order + 1 }
    }
  }
  return op2
}

export function transformMoveVsRemove(op1: Operation, op2: Operation): Operation | null {
  if (!op1.draggedComponent || !op2.targetComponent) return op2
  
  // If trying to remove the component that was moved, update the remove target
  if (op1.draggedComponent.id === op2.targetComponent.id) {
    return {
      ...op2,
      targetComponent: {
        ...op2.targetComponent,
        order: op1.dropTargetComponent!.order
      }
    }
  }
  
  // Adjust remove position based on move
  const dragIndex = op1.draggedComponent.order
  const dropIndex = op1.dropTargetComponent!.order
  const removeIndex = op2.targetComponent.order
  
  if (removeIndex >= Math.min(dragIndex, dropIndex) && removeIndex <= Math.max(dragIndex, dropIndex)) {
    if (dragIndex < dropIndex && removeIndex > dragIndex) {
      return {
        ...op2,
        targetComponent: { ...op2.targetComponent, order: removeIndex - 1 }
      }
    } else if (dragIndex > dropIndex && removeIndex < dragIndex) {
      return {
        ...op2,
        targetComponent: { ...op2.targetComponent, order: removeIndex + 1 }
      }
    }
  }
  
  return op2
}

export function transformUpdateVsRemove(op1: Operation, op2: Operation): Operation | null {
  // If updating a component that was removed, operation becomes no-op
  if (op1.componentId === op2.targetComponent?.id) {
    return null
  }
  return op2
}