'use client'
import { useState, useEffect } from "react"
import { FormMode } from "@/app/types/formMode"
import { EmailInputProps } from "@/app/types/formComponent"
import { validateEmail } from "@/app/utils/emailValidation"
import { useFormStore } from "@/app/store/formStore"
import { useDebouncedComponentUpdate } from "@/app/utils/useDebouncePropertyUpdate"

const EmailInput = (componentProp: EmailInputProps) => {
    const { id, text, ariaLabel, placeholder, formMode, required } = componentProp
    const [email, setEmail] = useState('')
    const [emailValid, setEmailValid] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')
    
    // const updateComponentProperty = useFormStore(state => state.updateComponentProperty)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
        const { isValid, errorMessage } = validateEmail(e.target.value)
        setEmailValid(isValid)
        setErrorMessage(errorMessage)
    }

    const { localValue: localText, handleChange: handleLabelChange } = 
        useDebouncedComponentUpdate(id, 'text', text)
    
    const { localValue: localPlaceholder, handleChange: handlePlaceholderChange } = 
        useDebouncedComponentUpdate(id, 'placeholder', placeholder || '')

    return (
        <div id={id} className="w-full flex flex-col">
            {formMode === 'edit' && (
                <div className="form-text-input">
                    <label htmlFor='email-label' className="w-full">
                        <input name='email-label'
                            id="email-label"
                            className='title-text w-full'
                            value={localText}
                            onChange={handleLabelChange}
                        />
                    </label>
                    <label htmlFor='email-placeholder' className="w-full">
                        <input 
                            type="text"
                            id="email-placeholder"
                            name="email-placeholder"
                            aria-label={ariaLabel}
                            className={`w-full px-4 py-2 border rounded-md`}
                            value={localPlaceholder}
                            onChange={handlePlaceholderChange}
                            placeholder={placeholder}
                        />
                    </label>
                </div>
            )}

            {/* Preview Email input */}
            {formMode === 'preview' && (
                <div className="form-text-input">
                    <label htmlFor="email-preview"
                        className='title-text text-left w-full'
                    >
                        {text}
                    </label>
                    <input
                        id="email-preview"
                        type="email"
                        name="email"
                        aria-label={ariaLabel}
                        className={`w-full px-4 py-2 border rounded-md ${!emailValid ? 'border-red-500' : ''}`}
                        value={email}
                        onChange={handleChange}
                        placeholder={placeholder}
                    />
                    {!emailValid && (
                        <div className="w-full text-[var(--warning)]" role="status" aria-live="polite">
                            {errorMessage}
                        </div>
                    )}

                </div>
            )}

        </div>
    )
}

export default EmailInput