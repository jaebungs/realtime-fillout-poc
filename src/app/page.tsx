'use client'
import { useState } from 'react'
import EditorNav from '@/app/components/EditorNav'
import ComponentPanel from '@/app/components/ComponentPanel'
import EditCanvas from '@/app/components/EditCanvas'

export default function Home() {
  return (
    <div className="">
      <EditorNav/>
      <div className="flex">
        <ComponentPanel/>
        <div className="flex p-5 w-full pb-3">
          <EditCanvas />
        </div>
      </div>
    </div>
  )
}
