export interface FormComponent {
    id: string,
    order: number,
    componentName: string,
    text: string
    ariaLabel?: string
    placeholder?: string,
    required?: boolean
    error?: boolean
    errorMessage?: string
}

export interface BaseFieldAttributes {
  text: string;
  ariaLabel?: string;
  placeholder?: string;
}

export interface EmailInputProps {
    id: string,
    text: string
    ariaLabel?: string
    placeholder?: string
    required?: boolean
    error?: boolean
    errorMessage?: string
}

export interface ShortAnswerInputProps {
    id: string,
    text: string
    ariaLabel?: string
    placeholder?: string
    required?: boolean
    error?: boolean
    errorMessage?: string
}

export type ComponentName = 'EmailInput' | 'ShortAnswerInput';
