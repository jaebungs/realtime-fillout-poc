'use client'
import { useState } from 'react'
import EditorNav from '@/app/components/EditorNav'
import EmailInput from "@/app/formComponents/EmailInput"
import ShortAnswerInput from "@/app/formComponents/ShortAnswerInput"
import { FormMode } from "@/app/types/formMode"

export default function Home() {
  const [currentMode, setCurrentMode] = useState<FormMode>('edit')

  const handleModeChange = (mode: FormMode) => {
    setCurrentMode(mode)
  }
  return (
    <div className="">
      <EditorNav handleModeChange={handleModeChange} />
      <div className="w-96">
        <EmailInput text="Email" label="Email" placeholder="Enter your email" formMode={currentMode} />
        <ShortAnswerInput text="Short Answer" ariaLabel="Short Answer" placeholder="Enter your short answer" formMode={currentMode} />
      </div>
    </div>
  )
}
