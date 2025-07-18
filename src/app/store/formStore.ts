import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { FormMode } from '@/app/types/formMode'
import { FormComponent } from '@/app/types/formComponent'
import initialFieldAttributes from '@/app/utils/initialFieldAttributes'
import { v4 as uuidv4 } from 'uuid'

interface FormStore {
    formComponents: FormComponent[]
    formMode: FormMode,
    selectedComponent: FormComponent | null,
    changeFormMode: (mode: FormMode) => void
    addFormComponent: (name: keyof typeof initialFieldAttributes, order: number) => void
    changeFormOrder: (draggedComponent: FormComponent, dropTargetComponent: FormComponent) => void
    removeFormComponent: (form: FormComponent) => void
    selectComponent: (component: FormComponent | null) => void
    clearSelectedComponent: () => void
}

export const useFormStore = create<FormStore>()(
  devtools(
    (set, get) => ({
        formComponents: [],
        formMode: 'edit',
        selectedComponent: null,
        changeFormMode: (mode) => set({ formMode: mode }),
        selectComponent: (component) => set({ selectedComponent: component }),
        addFormComponent: (name, order) => set((state) => {
            const component = {
                id: uuidv4(),
                order: order,
                componentName: name,
                ...initialFieldAttributes[name]
            }

            const newFormComponents = [...state.formComponents, component].sort((a, b) => a.order - b.order)
            return {formComponents : newFormComponents}
        }),
        changeFormOrder: (draggedComponent, dropTargetComponent) => set(state => {
            if (!draggedComponent) return state
            console.log(draggedComponent.order, dropTargetComponent.order)
            if (draggedComponent.order === dropTargetComponent.order) return state

            const dragComponentPosition = draggedComponent.order
            const targetPosition = dropTargetComponent.order
            // move the dragging component to the new position
            const filteredComponents = state.formComponents.filter(form => form.id !== draggedComponent.id)
            const newComponents = [...filteredComponents]
            newComponents.splice(targetPosition, 0, { ...draggedComponent, order: targetPosition })

            // update the order property of the component that is being replaced
            const replacedComponent = newComponents.find(form => form.id === dropTargetComponent.id)
            if (replacedComponent) {
                replacedComponent.order = dragComponentPosition
            }
            return { formComponents: newComponents }
        }),
        removeFormComponent: (form) => set((state) => {
            const newFormComponents = state.formComponents.filter(comp => comp.id !== form.id)

            // Update the order of remaining components to maintain proper sequence
            const updatedComponents = newFormComponents.map((comp, index) => ({
                ...comp,
                order: index
            }))
            
            return {
                formComponents: updatedComponents,
                selectedComponent: null
            }
        }),
        
        clearFormComponents: () => set({ formComponents: [] }),
        clearSelectedComponent: () => set({ selectedComponent: null })
    }),
    {
      name: 'form-store',
    }
  )
)
