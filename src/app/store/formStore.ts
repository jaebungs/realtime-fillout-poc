import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { FormMode } from '@/app/types/formMode'
import { FormComponent } from '@/app/types/formComponent'

interface FormStore {
    formComponents: FormComponent[]
    formMode: FormMode,
    selectedComponent: FormComponent,
    changeFormMode: (mode: FormMode) => void
    addFormComponent: (component: FormComponent) => void
    changeFormOrder: (draggedComponent: FormComponent, dropTargetComponent: FormComponent) => void
    removeFormComponent: (id: string) => void
    clearFormComponents: () => void
    selectComponent: (component: FormComponent) => void
}

const testInitialCompoennt = [
    {
        id: 'a',
        order: 0,
        componentName: 'EmailInput'
    },
    {
        id: 'b',
        order: 1,
        componentName: 'ShortAnswerInput'
    },
    {
        id: 'c',
        order: 2,
        componentName: 'EmailInput'
    },
]

export const useFormStore = create<FormStore>()(
  devtools(
    (set, get) => ({
        formComponents: testInitialCompoennt,
        formMode: 'edit',
        selectedComponent: null,
        changeFormMode: (mode) => set({ formMode: mode }),
        selectComponent: (component) => set({ selectedComponent: component }),
        addFormComponent: (component) => set((state) => ({
            formComponents: [...state.formComponents, component].sort((a, b) => a.order - b.order)
        })),
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
        removeFormComponent: (id) => set((state) => ({
            formComponents: state.formComponents.filter(comp => comp.id !== id)
        })),
        
        clearFormComponents: () => set({ formComponents: [] })
    }),
    {
      name: 'form-store',
    }
  )
)
