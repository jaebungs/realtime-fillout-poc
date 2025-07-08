import React from 'react'
import EmailInput from "@/app/formComponents/EmailInput"
import ShortAnswerInput from "@/app/formComponents/ShortAnswerInput"
import { renderComponent } from "@/app/utils/renderComponent" 
import { useFormStore } from '@/app/store/formStore'

const EditCanvas = () => {
    const formComponents = useFormStore(state => state.formComponents)
    const formMode = useFormStore(state => state.formMode)
    const selectedComponentId = useFormStore(state => state.selectedComponentId)
    const selectComponent = useFormStore(state => state.selectComponent)
//   const { addFormComponent } = useFormStore

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, componentId: string) => {
    // e.dataTransfer.setData('text/plain', componentId)
    console.log('onDragStart', componentId)
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault()
    // const draggedId = e.dataTransfer.getData('text/plain')
    console.log('onDrop', { targetIndex })
  }

  const handleComponentClick = (componentId: string) => {
    selectComponent(componentId)
  }

  return (
    <div className="w-96 sm:pb-4 flex items-center flex-col h-full gap-1">
      { 
        formComponents.map((form, index) => {
          const isSelected = selectedComponentId === form.id
          return <div 
            key={form.id}
            className={`${isSelected 
              ? 'border-2 border-[rgba(238,212,63,0.7)]' 
              : 'border border-transparent hover:border-[rgba(238,212,63,0.7)]'
            }`}
          >
            <div className="w-full ">+</div>
            <div 
              draggable
              onDragStart={(e) => onDragStart(e, form.id)}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, index)}
              onClick={() => handleComponentClick(form.id)}
              className="cursor-pointer"
            >
              {renderComponent(form)}
            </div>
          </div>
        })
      }
  </div>
  )
}

export default EditCanvas