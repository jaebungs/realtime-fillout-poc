'use client'
import { useState } from "react"
import { FormMode } from "@/app/types/formMode"
import { ShortAnswerInputProps } from "@/app/types/formComponent"
import { useFormStore } from "@/app/store/formStore"
import { useDebouncedComponentUpdate } from "@/app/utils/useDebouncePropertyUpdate"

const shortAnswerInput = (props: ShortAnswerInputProps) => {
    const { id, text, ariaLabel, placeholder, formMode, required, error, errorMessage } = props
    const [shortAnswer, setShortAnswer] = useState('')
    
    const updateComponentProperty = useFormStore(state => state.updateComponentProperty)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
        setShortAnswer(e.target.value)
    }

    const { localValue: localText, handleChange: handleLabelChange } = 
        useDebouncedComponentUpdate(id, 'text', text)
    
    const { localValue: localPlaceholder, handleChange: handlePlaceholderChange } = 
        useDebouncedComponentUpdate(id, 'placeholder', placeholder || '')


    return (
        <div className="w-full flex flex-col">

            {formMode === 'edit' && (
                <div className="form-text-input">
                    <input 
                        type='text'
                        name='short-answer-label'
                        className="w-full"
                        value={localText}
                        onChange={handleLabelChange}
                    />
                    <input
                        type="text"
                        name="short-answer-placeholder"
                        aria-label={ariaLabel}
                        className={`w-full px-4 py-2 border rounded-md`}
                        value={localPlaceholder}
                        onChange={handlePlaceholderChange}
                        placeholder={placeholder}
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
                        {text}
                    </label>
                    <input 
                        type="text"
                        name="short-answer"
                        id="short-answer"
                        aria-label={ariaLabel}
                        className={`w-full px-4 py-2 border rounded-md ${error ? 'border-red-500' : ''}`}
                        value={shortAnswer}
                        onChange={handleChange}
                        placeholder={placeholder}
                    />
                </div>
            )}

        </div>
    )
}

export default shortAnswerInput