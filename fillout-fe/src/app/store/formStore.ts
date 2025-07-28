import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { FormMode } from '@/app/types/formMode'
import { FormComponent } from '@/app/types/formComponent'
import { wsInstance } from '@/app/utils/websocket'
import initialFieldAttributes from '@/app/utils/initialFieldAttributes'
import { v4 as uuidv4 } from 'uuid'

interface FormStore {
    userId: string
    formComponents: FormComponent[]
    formMode: FormMode,
    selectedComponent: FormComponent | null,
    updateFormComponents: (newFormComponents : FormComponent[]) => void
    changeFormMode: (mode: FormMode) => void
    addFormComponent: (name: keyof typeof initialFieldAttributes, order: number) => void
    addFormComponentAtPosition: (name: keyof typeof initialFieldAttributes, position: number) => void
    changeFormOrder: (draggedComponent: FormComponent, dropTargetComponent: FormComponent) => void
    removeFormComponent: (form: FormComponent) => void
    selectComponent: (component: FormComponent | null) => void
    clearSelectedComponent: () => void
    updateComponentProperty: (componentId: string, property: keyof FormComponent, value: any) => void
    setClientId: (userId: string) => void
}

/**
 * The commented code below is for FE only fillout, using store before websocket was implemented
 * Uncomment it and comment ws related code to make non-realtime FE work
 */
export const useFormStore = create<FormStore>()(
  devtools(
    (set, get) => ({
        userId: '',
        formComponents: [],
        formMode: 'edit',
        selectedComponent: null,
        setClientId: (userId: string) => set({ userId }),
        updateFormComponents: (newFormComponents) => set({ formComponents: newFormComponents}),
        changeFormMode: (mode) => set({ formMode: mode }),
        selectComponent: (component) => set({ selectedComponent: component }),
        addFormComponent: (name, order) => set((state) => {
            // const component = {
            //     id: uuidv4(),
            //     order: order,
            //     componentName: name,
            //     ...initialFieldAttributes[name]
            // }

            // const newFormComponents = [...state.formComponents, component].sort((a, b) => a.order - b.order)
            
            wsInstance.send(JSON.stringify({
                type: 'addFormComponent',
                userId: state.userId,
                componentName: name,
                order: 'last'
            }))
            // return {formComponents : newFormComponents}
            return {}
        }),
        addFormComponentAtPosition: (name, position) => set((state) => {
            // const component = {
            //     id: uuidv4(),
            //     order: position,
            //     componentName: name,
            //     ...initialFieldAttributes[name]
            // }

            // // Insert the component at the specified position
            // const newFormComponents = [...state.formComponents]
            // newFormComponents.splice(position, 0, component)
            
            // // Update the order of all components after the insertion point
            // for (let i = position + 1; i < newFormComponents.length; i++) {
            //     newFormComponents[i].order = i
            // }
            wsInstance.send(JSON.stringify({
                type: 'addFormComponentAtPosition',
                userId: state.userId,
                componentName: name,
                order: position
            }))
            // return { formComponents: newFormComponents }
            return {}
        }),
        changeFormOrder: (draggedComponent, dropTargetComponent) => set(state => {
            // if (!draggedComponent) return state
            // console.log(draggedComponent.order, dropTargetComponent.order)
            // if (draggedComponent.order === dropTargetComponent.order) return state

            // const dragComponentPosition = draggedComponent.order
            // const targetPosition = dropTargetComponent.order
            // // move the dragging component to the new position
            // const filteredComponents = state.formComponents.filter(form => form.id !== draggedComponent.id)
            // const newComponents = [...filteredComponents]
            // newComponents.splice(targetPosition, 0, { ...draggedComponent, order: targetPosition })

            // // update the order property of the component that is being replaced
            // const replacedComponent = newComponents.find(form => form.id === dropTargetComponent.id)
            // if (replacedComponent) {
            //     replacedComponent.order = dragComponentPosition
            // }

            wsInstance.send(JSON.stringify({
                type: 'changeFormOrder',
                userId: state.userId,
                draggedComponent,
                dropTargetComponent
            }))
            // return { formComponents: newComponents }
            return {}
        }),
        removeFormComponent: (form) => set((state) => {
            // const newFormComponents = state.formComponents.filter(comp => comp.id !== form.id)

            // // Update the order of remaining components to maintain proper sequence
            // const updatedComponents = newFormComponents.map((comp, index) => ({
            //     ...comp,
            //     order: index
            // }))

            // WS migration
            wsInstance.send(JSON.stringify({
                type: 'removeFormComponent',
                userId: state.userId,
                targetComponent: form
            }))
            
            // return {
            //     formComponents: updatedComponents,
            //     selectedComponent: null
            // }
            return {}
        }),
        
        clearFormComponents: () => set({ formComponents: [] }),
        clearSelectedComponent: () => set({ selectedComponent: null }),
        updateComponentProperty: (componentId, property, value) => set((state) => {
            wsInstance.send(JSON.stringify({
                type: 'updateComponentProperty',
                userId: state.userId,
                componentId, 
                property,
                value
            }))
            // Do not update local state here; wait for backend broadcast
            return {}
        })
    }),
    {
      name: 'form-store',
    }
  )
)
