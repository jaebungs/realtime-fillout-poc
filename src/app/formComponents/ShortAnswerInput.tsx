'use client'
import { useState } from "react"

interface ShortAnswerInputProps {
    text: string
    label?: string
    placeholder?: string
    required?: boolean
    error?: boolean
    errorMessage?: string
}

const shortAnswerInput = (props: ShortAnswerInputProps) => {
    const { text, label, placeholder, required, error, errorMessage } = props
    const [input, setInput] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
        setInput(e.target.value)
    }
    return (
        <div>
            <label htmlFor="email">{text}</label>
            <input 
                type="text"
                name="text"
                aria-label={label}
                className={`px-4 py-2 border rounded-md ${error ? 'border-red-500' : ''}`}
                value={input}
                onChange={handleChange}
                placeholder={placeholder}
            />
        </div>
    )
}

export default shortAnswerInput