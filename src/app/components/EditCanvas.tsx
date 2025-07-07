import React from 'react'
import EmailInput from "@/app/formComponents/EmailInput"
import ShortAnswerInput from "@/app/formComponents/ShortAnswerInput"
import { renderComponent } from "@/app/utils/renderComponent" 
import { useFormStore } from '@/app/store/formStore'

const EditCanvas = () => {
    const formComponents = useFormStore(state => state.formComponents)
  const formMode = useFormStore(state => state.formMode)
//   const { addFormComponent } = useFormStore

  const onDragStart = (e:  React.DragEvent<HTMLDivElement>) => {
    console.log(e)
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {

  }

  return (
    <div className="w-96 sm:pb-4 flex items-center flex-col h-full gap-1">
      { 
        formComponents.map((form, index) => {
          return <div key={form.id}>{renderComponent(form)}</div>
        })
      }
  </div>
  )
}

export default EditCanvas