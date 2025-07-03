'use client'
import { useState } from "react"
import { FormMode } from "@/app/types/formMode"

interface ShortAnswerInputProps {
    text: string
    ariaLabel?: string
    placeholder?: string
    formMode: FormMode
    required?: boolean
    error?: boolean
    errorMessage?: string
}

const shortAnswerInput = (props: ShortAnswerInputProps) => {
    const { text, ariaLabel, placeholder, formMode, required, error, errorMessage } = props
    const [shortAnswer, setShortAnswer] = useState('')
    const [shortAnswerLabel, setshortAnswerLabel] = useState(text)
    const [shortAnswerPlaceholder, setShortAnswerPlaceholder] = useState(placeholder)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
        setShortAnswer(e.target.value)
    }
    return (
        <div>

            {formMode === 'edit' && (
                <>
                    <input 
                        type='text'
                        name='short-answer-label'
                        value={shortAnswerLabel}
                        onChange={(e) => setshortAnswerLabel(e.target.value)}
                    />
                    <input 
                        type="text"
                        name="short-answer-placeholder"
                        aria-label={ariaLabel}
                        className={`px-4 py-2 border rounded-md ${error ? 'border-red-500' : ''}`}
                        value={shortAnswerPlaceholder}
                        onChange={(e) => setShortAnswerPlaceholder(e.target.value)}
                        placeholder={shortAnswerPlaceholder}
                    />
                </>
            )}

            {/* Preview short answer */}
            {formMode === 'preview' && (
                <>
                    <label htmlFor="text">{shortAnswerLabel}</label>
                    <input 
                        type="text"
                        name="short-answer"
                        aria-label={ariaLabel}
                        className={`px-4 py-2 border rounded-md ${error ? 'border-red-500' : ''}`}
                        value={shortAnswer}
                        onChange={handleChange}
                        placeholder={shortAnswerPlaceholder}
                    />
                </>
            )}

        </div>
    )
}

export default shortAnswerInput