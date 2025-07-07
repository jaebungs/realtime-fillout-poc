import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { FormMode } from '@/app/types/formMode'
import { FormComponent } from '@/app/types/formComponent'

interface FormStore {
    formComponents: FormComponent[]
    formMode: FormMode,
    changeFormMode: (mode: FormMode) => void
    addFormComponent: (component: FormComponent) => void
    removeFormComponent: (id: string) => void
    clearFormComponents: () => void
}

const testInitialCompoennt = [
    {
        id: 'a',
        order: 1,
        componentName: 'EmailInput'
    },
    {
        id: 'b',
        order: 2,
        componentName: 'ShortAnswerInput'
    }
]

export const useFormStore = create<FormStore>()(
  devtools(
    (set, get) => ({
        formComponents: testInitialCompoennt,
        formMode: 'edit',
        changeFormMode: (mode) => set({ formMode: mode }),
        addFormComponent: (component) => set((state) => ({
            formComponents: [...state.formComponents, component].sort((a, b) => a.order - b.order)
        })),
        
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
