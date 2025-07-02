'use client'
import { useState } from "react"
import { FormMode } from "@/app/types/formMode"

interface EmailInputProps {
    text: string
    label?: string
    placeholder?: string
    formMode: FormMode
    required?: boolean
    error?: boolean
    errorMessage?: string
}

const EmailInput = (props: EmailInputProps) => {
    const { text, label, placeholder, formMode, required, error, errorMessage } = props
    const [email, setEmail] = useState('')
    const [emailLabel, setEmailLabel] = useState(text)
    const [emailPlaceholder, setEmailPlaceholder] = useState(placeholder)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
        setEmail(e.target.value)
    }
    return (
        <div className="w-full flex flex-col">
            {formMode === 'edit' && (
                <>
                <label>
                    <input name='email-label' 
                        onChange={(e) => setEmailLabel(e.target.value)}    
                    />
                </label>
                <input 
                    type="email"
                    name="email"
                    aria-label={label}
                    className={`px-4 py-2 border rounded-md ${error ? 'border-red-500' : ''}`}
                    value={emailPlaceholder}
                    onChange={(e) => setEmailPlaceholder(e.target.value)}
                    placeholder={emailPlaceholder}
                />
                </>

            )}

            {/* Preview Email input */}
            {formMode === 'preview' && (
                <>
                    <label htmlFor="email">{emailLabel}</label>
                    <input 
                        type="email"
                        name="email"
                        aria-label={label}
                        className={`px-4 py-2 border rounded-md ${error ? 'border-red-500' : ''}`}
                        value={email}
                        onChange={handleChange}
                        placeholder={emailPlaceholder}
                    />
                </>
            )}

        </div>
    )
}

export default EmailInput