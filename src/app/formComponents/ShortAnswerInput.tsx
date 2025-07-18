'use client'
import { useState } from "react"
import { FormMode } from "@/app/types/formMode"
import { ShortAnswerInputProps } from "@/app/types/formComponent"

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
        <div className="w-full flex flex-col">

            {formMode === 'edit' && (
                <div className="form-text-input">
                    <input 
                        type='text'
                        name='short-answer-label'
                        className="w-full"
                        value={shortAnswerLabel}
                        onChange={(e) => setshortAnswerLabel(e.target.value)}
                    />
                    <input
                        type="text"
                        name="short-answer-placeholder"
                        aria-label={ariaLabel}
                        className={`w-full px-4 py-2 border rounded-md`}
                        value={shortAnswerPlaceholder}
                        onChange={(e) => setShortAnswerPlaceholder(e.target.value)}
                        placeholder={shortAnswerPlaceholder}
                    />
                </div>
            )}

            {/* Preview short answer */}
            {formMode === 'preview' && (
                <div className="form-text-input">
                    <label 
                        htmlFor="short-answer"
                        className="title-text text-left w-full"
                    >
                        {shortAnswerLabel}
                    </label>
                    <input 
                        type="text"
                        name="short-answer"
                        id="short-answer"
                        aria-label={ariaLabel}
                        className={`w-full px-4 py-2 border rounded-md ${error ? 'border-red-500' : ''}`}
                        value={shortAnswer}
                        onChange={handleChange}
                        placeholder={shortAnswerPlaceholder}
                    />
                </div>
            )}

        </div>
    )
}

export default shortAnswerInput