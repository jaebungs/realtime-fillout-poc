import React, { useState, useRef } from 'react'
import EmailInput from "@/app/formComponents/EmailInput"
import ShortAnswerInput from "@/app/formComponents/ShortAnswerInput"
import { renderComponent } from "@/app/utils/renderComponent" 
import { useFormStore } from '@/app/store/formStore'
import { FormComponent } from '@/app/types/formComponent'

const EditCanvas = () => {
  const formComponents = useFormStore(state => state.formComponents)
  const formMode = useFormStore(state => state.formMode)
  const selectedComponent = useFormStore(state => state.selectedComponent)
  const changeFormOrder = useFormStore(state => state.changeFormOrder)
  const removeFormComponent = useFormStore(state => state.removeFormComponent)
  const selectComponent = useFormStore(state => state.selectComponent)

  const [highlightedDropRow, setHighlightedDropRow] = useState<number | null>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, form : FormComponent) => {
    selectComponent(form)
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    const row = rowRefs.current[index]
    if (row) {
      const rect = row.getBoundingClientRect()
      const offsetY = e.clientY - rect.top
      if (offsetY < rect.height / 2) {
        setHighlightedDropRow(index)
      } else {
        setHighlightedDropRow(index + 1)
      }
    }
  }

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    setHighlightedDropRow(null)
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>, targetComponent: FormComponent, index: number) => {
    e.preventDefault()
    setHighlightedDropRow(null)
    if (selectedComponent) {
      changeFormOrder(selectedComponent, targetComponent)
    }
  }

  const handleComponentClick = (form: FormComponent) => {
    selectComponent(form)
  }

  const handleRemoveComponent = (form: FormComponent, e: React.MouseEvent) => {
    e.stopPropagation()
    removeFormComponent(form)
  }

  return (
    <div className="relative flex w-full flex-col justify-center items-center max-w-[660px]">
      { 
        formComponents.map((form, index) => {
          return (
            <div 
              key={form.id}
              className='relative w-full'
            >
              <div
                id={`DROPABOVEROW-${index}`}
                className={`w-full absolute left-0 -top-1 right-0 h-1 z-1 ${highlightedDropRow === index ? 'bg-[rgba(238,212,63)]' : ''}`}
                style={{ transition: 'background 0.15s' }}
              >
                {highlightedDropRow === index && (
                  <div className="flex justify-center items-center h-full">
                    <span
                      className="flex justify-center items-center rounded-full"
                      style={{
                        width: 24,
                        height: 24,
                        background: 'rgba(238,212,63,1)',
                        boxShadow: '0 0 4px rgba(238,212,63,0.5)',
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16">
                        <line x1="8" y1="3" x2="8" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="3" y1="8" x2="13" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </span>
                  </div>
                )}
              </div>
              <div 
                ref={el => { rowRefs.current[index] = el }}
                draggable
                onDragStart={(e) => onDragStart(e, form)}
                onDragOver={(e) => onDragOver(e, index)}
                onDragLeave={(e) => onDragLeave(e, index)}
                onDrop={(e) => onDrop(e, form, index)}
                onClick={() => handleComponentClick(form)}
                className={`w-full flex items-center py-1 pr-3
                  ${selectedComponent?.id === form.id 
                  ? 'border-2 border-[rgba(238,212,63)]' 
                  : 'border border-transparent hover:border-[rgba(238,212,63,0.7)]'
                }`}
              >
                <div className='w-7 min-h-full cursor-move flex justify-center items-center flex-shrink-0'>
                  <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 10C4.55228 10 5 9.5523 5 9C5 8.4477 4.55228 8 4 8C3.44772 8 3 8.4477 3 9C3 9.5523 3.44772 10 4 10Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M4 4C4.55228 4 5 3.55228 5 3C5 2.44772 4.55228 2 4 2C3.44772 2 3 2.44772 3 3C3 3.55228 3.44772 4 4 4Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M11 4C11.5523 4 12 3.55228 12 3C12 2.44772 11.5523 2 11 2C10.4477 2 10 2.44772 10 3C10 3.55228 10.4477 4 11 4Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M11 10C11.5523 10 12 9.5523 12 9C12 8.4477 11.5523 8 11 8C10.4477 8 10 8.4477 10 9C10 9.5523 10.4477 10 11 10Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M11 16C11.5523 16 12 15.5523 12 15C12 14.4477 11.5523 14 11 14C10.4477 14 10 14.4477 10 15C10 15.5523 10.4477 16 11 16Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M4 16C4.55228 16 5 15.5523 5 15C5 14.4477 4.55228 14 4 14C3.44772 14 3 14.4477 3 15C3 15.5523 3.44772 16 4 16Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </div>
                <div 
                  className="w-full py-[6px] cursor-pointer"
                >
                  {renderComponent(form, formMode)}
                </div>
                {selectedComponent?.id === form.id && (
                  <div className="absolute right-[-55px] bg-white shadow-xl rounded-full p-1 px-[3px] z-[2] border border-gray-100 gap-[2px]">
                    <button className="hover:bg-red-50 rounded-full p-[6px] flex justify-center items-center cursor-pointer text-red-500"
                      onClick={(e) => handleRemoveComponent(form, e)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" className="h-[22px] w-[22px] "><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })
      }
      {/* Render a final DROPABOVEROW at the end for dropping at the end of the list */}
      <div
        id={`DROPABOVEROW-${formComponents.length}`}
        className={`w-full h-1 ${highlightedDropRow === formComponents.length ? 'bg-[rgba(238,212,63)]' : ''}`}
        style={{ transition: 'background 0.15s' }}
      >
        {highlightedDropRow === formComponents.length && (
          <div className="flex justify-center items-center h-full">
            <span
              className="flex justify-center items-center rounded-full"
              style={{
                width: 24,
                height: 24,
                background: 'rgba(238,212,63,1)',
                boxShadow: '0 0 4px rgba(238,212,63,0.5)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16">
                <line x1="8" y1="3" x2="8" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="8" x2="13" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default EditCanvas