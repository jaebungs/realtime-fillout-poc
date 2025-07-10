import React, { useState } from 'react'
import EmailInput from "@/app/formComponents/EmailInput"
import ShortAnswerInput from "@/app/formComponents/ShortAnswerInput"
import { renderComponent } from "@/app/utils/renderComponent" 
import { useFormStore } from '@/app/store/formStore'
import { FormComponent } from '@/app/types/formComponent'

const EditCanvas = () => {
  const formComponents = useFormStore(state => state.formComponents)
  const formMode = useFormStore(state => state.formMode)
  // const selectedComponent = useFormStore(state => state.selectedComponent)
  // const selectComponent = useFormStore(state => state.selectComponent)
  const changeFormOrder = useFormStore(state => state.changeFormOrder)
  const [ selectedComponent, setSelectedComponent ] = useState<FormComponent | null>(null)


  const onDragStart = (e: React.DragEvent<HTMLDivElement>, form : FormComponent) => {

    setSelectedComponent(form)
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>, form: FormComponent, targetIndex: number) => {
    e.preventDefault()

    if (selectedComponent) {
      changeFormOrder(selectedComponent, targetIndex)
    }
  }

  const handleComponentClick = (form: FormComponent) => {
    setSelectedComponent(form)
  }

  return (
    <div className="flex w-full h-full justify-center overflow-hidden rounded-xl border-[0.5px] border-gray-300 shadow-lg">
      <div className="flex w-full flex-col justify-center items-center max-w-[660px]">
      { 
        formComponents.map((form, index) => {
          const isSelected = selectedComponent?.id === form.id
          return <div 
            key={form.id}
            draggable
            onDragStart={(e) => onDragStart(e, form)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, form, index)}
            onClick={() => handleComponentClick(form)}
            className={`w-full flex items-center
              ${isSelected 
              ? 'border-2 border-[rgba(238,212,63,0.7)]' 
              : 'border border-transparent hover:border-[rgba(238,212,63,0.7)]'
            }`}
          >
            <div className='w-7 min-h-full cursor-move flex justify-center items-center flex-shrink-0'>
              <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 10C4.55228 10 5 9.5523 5 9C5 8.4477 4.55228 8 4 8C3.44772 8 3 8.4477 3 9C3 9.5523 3.44772 10 4 10Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M4 4C4.55228 4 5 3.55228 5 3C5 2.44772 4.55228 2 4 2C3.44772 2 3 2.44772 3 3C3 3.55228 3.44772 4 4 4Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M11 4C11.5523 4 12 3.55228 12 3C12 2.44772 11.5523 2 11 2C10.4477 2 10 2.44772 10 3C10 3.55228 10.4477 4 11 4Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M11 10C11.5523 10 12 9.5523 12 9C12 8.4477 11.5523 8 11 8C10.4477 8 10 8.4477 10 9C10 9.5523 10.4477 10 11 10Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M11 16C11.5523 16 12 15.5523 12 15C12 14.4477 11.5523 14 11 14C10.4477 14 10 14.4477 10 15C10 15.5523 10.4477 16 11 16Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M4 16C4.55228 16 5 15.5523 5 15C5 14.4477 4.55228 14 4 14C3.44772 14 3 14.4477 3 15C3 15.5523 3.44772 16 4 16Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            </div>
            <div 
              className="w-full py-[6px] cursor-pointer"
            >
              {renderComponent(form)}
            </div>
          </div>
        })
      }
      </div>
    </div>
  )
}

export default EditCanvas