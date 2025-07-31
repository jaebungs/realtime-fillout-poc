import { v4 as uuidv4 } from 'uuid'
import { Operation, OperationState } from './types'
import { transformOperation } from './transforms'
import { FormComponent } from '../types/componentTypes'
import initialFieldAttributes from '../utils/initialFieldAttributes'

export class OTEngine {
  private operationState: OperationState = {
    operations: [],
    sequenceNumber: 0
  }
  
  private formComponents: FormComponent[] = []
  private onStateChange?: (components: FormComponent[], operation: Operation) => void

  constructor(onStateChange?: (components: FormComponent[], operation: Operation) => void) {
    this.onStateChange = onStateChange
  }

  // Get current form components
  getFormComponents(): FormComponent[] {
    return [...this.formComponents]
  }

  // Get current sequence number
  getSequenceNumber(): number {
    return this.operationState.sequenceNumber
  }

  // Process operation with OT
  processOperation(operation: Operation): boolean {
    // Transform against all operations that happened after this operation's timestamp
    let transformedOp: Operation | null = operation
    
    for (const existingOp of this.operationState.operations) {
      if (existingOp.timestamp > operation.timestamp && transformedOp) {
        transformedOp = transformOperation(existingOp, transformedOp)
      }
    }
    
    // Apply the transformed operation if it's still valid
    if (transformedOp && this.applyOperation(transformedOp)) {
      // Add to operation history
      this.operationState.operations.push(operation)
      this.operationState.sequenceNumber++
      
      // Keep operation history manageable (keep last 1000 operations)
      if (this.operationState.operations.length > 1000) {
        this.operationState.operations = this.operationState.operations.slice(-1000)
      }
      
      // Notify state change
      if (this.onStateChange) {
        this.onStateChange(this.formComponents, transformedOp)
      }
      
      return true
    }
    
    return false
  }

  // Apply operation to form components
  private applyOperation(operation: Operation): boolean {
    try {
      switch (operation.type) {
        case 'add':
          if (operation.componentName) {
            this.addFormComponent(operation.componentName, operation.userId)
          }
          break
        
        case 'addAtPosition':
          if (operation.componentName && operation.order !== undefined) {
            this.addFormComponentAtPosition(operation.componentName, operation.order, operation.userId)
          }
          break
        
        case 'remove':
          if (operation.targetComponent) {
            this.removeFormComponent(operation.targetComponent, operation.userId)
          }
          break
        
        case 'move':
          if (operation.draggedComponent && operation.dropTargetComponent) {
            this.changeFormOrder(operation.draggedComponent, operation.dropTargetComponent, operation.userId)
          }
          break
        
        case 'update':
          if (operation.componentId && operation.property !== undefined && operation.value !== undefined) {
            this.updateComponentProperty(operation.componentId, operation.property, operation.value, operation.userId)
          }
          break
        
        default:
          return false
      }
      return true
    } catch (error) {
      console.error('Error applying operation:', error)
      return false
    }
  }

  // Form manipulation methods
  private addFormComponent(componentName: string, userId: string): void {
    const order = this.formComponents.length
    const initialAttributes = initialFieldAttributes[componentName]
    const component: FormComponent = {
      id: uuidv4(),
      userId,
      order,
      componentName,
      ...initialAttributes,
    }
    this.formComponents.push(component)
  }

  private addFormComponentAtPosition(componentName: string, order: number, userId: string): void {
    const initialAttributes = initialFieldAttributes[componentName]
    const component: FormComponent = {
      id: uuidv4(),
      userId,
      order,
      componentName,
      ...initialAttributes,
    }
    const newFormComponents: FormComponent[] = [...this.formComponents]
    newFormComponents.splice(order, 0, component)
    
    for (let i = order + 1; i < newFormComponents.length; i++) {
      newFormComponents[i].order = i
    }
    this.formComponents = newFormComponents
  }

  private changeFormOrder(draggedComponent: FormComponent, dropTargetComponent: FormComponent, userId: string): void {
    const draggedIndex = draggedComponent.order
    const dropIndex = dropTargetComponent.order
    if (draggedIndex === -1 || dropIndex === -1) return

    const newFormComponents = [...this.formComponents]
    const [moved] = newFormComponents.splice(draggedIndex, 1)
    newFormComponents.splice(dropIndex, 0, moved)

    const start = Math.min(draggedIndex, dropIndex)
    const end = Math.max(draggedIndex, dropIndex)

    for (let i = start; i <= end; i++) {
      newFormComponents[i].order = i
    }

    this.formComponents = newFormComponents
  }

  private removeFormComponent(targetComponent: FormComponent, userId: string): void {
    const newFormComponents = this.formComponents.filter(form => form.id !== targetComponent.id)
    for (let i = targetComponent.order; i < newFormComponents.length; i++) {
      newFormComponents[i].order = i
    }
    this.formComponents = newFormComponents
  }

  private updateComponentProperty(componentId: string, property: any, value: any, userId: string): void {
    const newFormComponents = this.formComponents.map(component =>
      component.id === componentId ? { ...component, [property]: value } : component
    )
    this.formComponents = newFormComponents
  }

  // Create operation from message
  static createOperationFromMessage(message: any): Operation {
    // Map message types to operation types
    const typeMapping: { [key: string]: Operation['type'] } = {
      'addFormComponent': 'add',
      'addFormComponentAtPosition': 'addAtPosition',
      'removeFormComponent': 'remove',
      'changeFormOrder': 'move',
      'updateComponentProperty': 'update'
    }

    return {
      operationId: message.operationId,
      type: typeMapping[message.type] || 'update',
      userId: message.userId,
      timestamp: message.timestamp || Date.now(),
      componentName: message.componentName,
      componentId: message.componentId,
      order: message.order,
      draggedComponent: message.draggedComponent,
      dropTargetComponent: message.dropTargetComponent,
      property: message.property,
      value: message.value,
      targetComponent: message.targetComponent,
    }
  }
}