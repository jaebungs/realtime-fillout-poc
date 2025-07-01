'use client'
import { useState } from "react"

interface EmailInputProps {
    text: string
    label?: string
    placeholder?: string
    required?: boolean
    error?: boolean
    errorMessage?: string
}

const EmailInput = (props: EmailInputProps) => {
    const { text, label, placeholder, required, error, errorMessage } = props
    const [email, setEmail] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
        setEmail(e.target.value)
    }
    return (
        <div>
            <label htmlFor="email">{text}</label>
            <input 
                type="email"
                name="email"
                aria-label={label}
                className={`px-4 py-2 border rounded-md ${error ? 'border-red-500' : ''}`}
                value={email}
                onChange={handleChange}
                placeholder={placeholder}
            />
        </div>
    )
}

export default EmailInput