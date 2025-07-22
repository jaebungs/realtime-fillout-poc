import React from 'react'
import { useFormStore } from '@/app/store/formStore'

const EditorNav = () => {
    const { changeFormMode } = useFormStore()
  return (
    <div className='pl-2 flex items-center w-full justify-between bg-gray-50  border-b-[0.5px] border-gray-300'>
        <div className='font-medium flex items-center py-[11px] md:min-w-[310px] largeXl:min-w-[354px] largeXlCustom:min-w-[424px]'>
            Fillout
        </div>
        <div className='flex h-[56px] items-center'>

        </div>
        <div className='flex justify-end items-center py-[11px] pr-7 gap-4 md:min-w-[310px] largeXl:min-w-[354px] largeXlCustom:min-w-[424px]'>
            <button className='inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0 select-none disabled:cursor-disabled -tracking-[0.01rem] border border-gray-200 shadow-sm hover:bg-gray-50 focus-visible:ring-black/30 bg-white text-[#1a1a1a] h-9 rounded-lg px-4 py-2'
                onClick={() => changeFormMode('edit')}
            >
                Edit
            </button>
            <button className='inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0 select-none disabled:cursor-disabled -tracking-[0.01rem] border border-gray-200 shadow-sm hover:bg-gray-50 focus-visible:ring-black/30 bg-white text-[#1a1a1a] h-9 rounded-lg px-4 py-2'
                onClick={() => changeFormMode('preview')}
            >
                Preview
            </button>
        </div>
    </div>
  )
}

export default EditorNav