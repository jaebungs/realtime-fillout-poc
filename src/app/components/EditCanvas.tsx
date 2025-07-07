import React from 'react'
import EmailInput from "@/app/formComponents/EmailInput"
import ShortAnswerInput from "@/app/formComponents/ShortAnswerInput"
import { useFormStore } from '@/app/store/formStore'

const EditCanvas = () => {
  const formMode = useFormStore(state => state.formMode)

  return (
    <div className="w-96 sm:pb-4 flex items-center flex-col h-full gap-1">
        <EmailInput text="Email" label="Email" placeholder="Enter your email" formMode={formMode} />
        <ShortAnswerInput text="Short Answer" ariaLabel="Short Answer" placeholder="Enter your short answer" formMode={formMode} />
  </div>
  )
}

export default EditCanvas