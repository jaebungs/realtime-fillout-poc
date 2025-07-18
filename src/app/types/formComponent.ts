import { FormMode } from "@/app/types/formMode"
export interface FormComponent {
    id: string,
    order: number,
    componentName: string,
    text: string
    ariaLabel?: string
    placeholder?: string,
    formMode?: FormMode
}

export interface EmailInputProps {
    text: string
    ariaLabel?: string
    placeholder?: string
    formMode: FormMode
    required?: boolean
    // error?: boolean
    // errorMessage?: string
}

export interface ShortAnswerInputProps {
    text: string
    ariaLabel?: string
    placeholder?: string
    formMode: FormMode
    required?: boolean
    error?: boolean
    errorMessage?: string
}
