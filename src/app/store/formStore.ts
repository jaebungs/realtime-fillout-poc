import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { FormMode } from '@/app/types/formMode'

interface FormComponent {
    id: string,
    order: number,
    componentName: string
}

interface FormStore {
    formComponents: FormComponent[]
    formMode: FormMode,
    changeFormMode: (mode: FormMode) => void
    addFormComponent: (component: FormComponent) => void
    removeFormComponent: (id: string) => void
    clearFormComponents: () => void
}

export const useFormStore = create<FormStore>()(
  devtools(
    (set, get) => ({
        formComponents: [],
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
