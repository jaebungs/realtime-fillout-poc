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
    changeFormOrder: (component: FormComponent, targetIndex: number) => void
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
        changeFormOrder: (component, targetIndex) => set(state => {
            if (!component) return state
            if (component.order === targetIndex) return state
            const filteredComponents = state.formComponents.filter(form => form.id !== component.id)
            const newComponents = [...filteredComponents]
            newComponents.splice(targetIndex, 0, { ...component, order: targetIndex })

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
