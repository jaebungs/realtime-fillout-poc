import { create } from 'zustand'

interface FormComponent {
    id: string,
    order: number,
    componentName: string
}

interface FormStore {
    formComponents: FormComponent[]
    addFormComponent: (component: FormComponent) => void
    removeFormComponent: (id: string) => void
    clearFormComponents: () => void
}

export const useFormStore = create<FormStore>((set, get) => ({
    formComponents: [],
    
    addFormComponent: (component) => set((state) => ({
        formComponents: [...state.formComponents, component].sort((a, b) => a.order - b.order)
    })),
    
    removeFormComponent: (id) => set((state) => ({
        formComponents: state.formComponents.filter(comp => comp.id !== id)
    })),
    
    clearFormComponents: () => set({ formComponents: [] })
}))
