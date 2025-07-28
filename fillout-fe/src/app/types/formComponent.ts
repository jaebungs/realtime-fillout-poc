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
export interface PendingOperation {
    taskId: string,
    userId: string,
    type: string,
    payload: any,
    timestamp: Date
}
export interface EmailInputProps {
    id: string,
    text: string
    ariaLabel?: string
    placeholder?: string
    formMode: FormMode
    required?: boolean
    // error?: boolean
    // errorMessage?: string
}

export interface ShortAnswerInputProps {
    id: string,
    text: string
    ariaLabel?: string
    placeholder?: string
    formMode: FormMode
    required?: boolean
    error?: boolean
    errorMessage?: string
}
