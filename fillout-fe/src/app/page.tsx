'use client'
import { useState } from 'react'
import { useFormStore } from '@/app/store/formStore'
import EditorNav from '@/app/components/EditorNav'
import ComponentPanel from '@/app/components/ComponentPanel'
import EditCanvas from '@/app/components/EditCanvas'
import Preview from '@/app/components/Preview'

export default function Home() {
  const formMode = useFormStore(state => state.formMode)

  return (
    <div className="">
      <EditorNav/>
      <div className="flex">
        <ComponentPanel/>
        <div className="flex p-5 w-full pb-3">
          <div className="flex w-full h-full justify-center overflow-hidden rounded-xl border-[0.5px] border-gray-300 shadow-lg">
            {formMode === 'edit' && <EditCanvas />}
            {formMode === 'preview' && <Preview /> }
          </div>
        </div>
      </div>
    </div>
  )
}
