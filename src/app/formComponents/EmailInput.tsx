'use client'
import { useState } from "react"
import { FormMode } from "@/app/types/formMode"
import { validateEmail } from "@/app/utils/emailValidation"

interface EmailInputProps {
    text: string
    label?: string
    placeholder?: string
    formMode: FormMode
    required?: boolean
    // error?: boolean
    // errorMessage?: string
}

const EmailInput = (props: EmailInputProps) => {
    const { text, label, placeholder, formMode, required } = props
    const [email, setEmail] = useState('')
    const [emailLabel, setEmailLabel] = useState(text)
    const [emailPlaceholder, setEmailPlaceholder] = useState(placeholder)
    const [emailValid, setEmailValid] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
        setEmail(e.target.value)
        const { isValid, errorMessage } = validateEmail(e.target.value)
        setEmailValid(isValid)
        setErrorMessage(errorMessage)
    }
    return (
        <div className="w-full flex flex-col">
            {formMode === 'edit' && (
                <div className="form-text-input">
                    <label htmlFor='email-label' className="w-full">
                        <input name='email-label'
                            id="email-label"
                            className='title-text w-full'
                            onChange={(e) => setEmailLabel(e.target.value)}    
                        />
                    </label>
                    <label htmlFor='email-placeholder' className="w-full">
                        <input 
                            type="text"
                            id="email-placeholder"
                            name="email-placeholder"
                            aria-label={label}
                            className={`w-full px-4 py-2 border rounded-md ${!emailValid ? 'border-red-500' : ''}`}
                            value={emailPlaceholder}
                            onChange={(e) => setEmailPlaceholder(e.target.value)}
                            placeholder={emailPlaceholder}
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
                        {emailLabel}
                    </label>
                    <input
                        id="email-preview"
                        type="email"
                        name="email"
                        aria-label={label}
                        className={`w-full px-4 py-2 border rounded-md ${!emailValid ? 'border-red-500' : ''}`}
                        value={email}
                        onChange={handleChange}
                        placeholder={emailPlaceholder}
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