'use client'
import { useState, useEffect } from 'react'
import { useFormStore } from '@/app/store/formStore'
import ws from '@/app/utils/websocket'
import EditorNav from '@/app/components/EditorNav'
import ComponentPanel from '@/app/components/ComponentPanel'
import EditCanvas from '@/app/components/EditCanvas'
import Preview from '@/app/components/Preview'

export default function Home() {
  const formMode = useFormStore(state => state.formMode)
  const [formComponents, setFormComponents] = useState([])

  useEffect(() => {
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'welcome' && data.formComponents) {
        setFormComponents(data.formComponents)
      }
      if (data.type === 'broadcast' && data.formComponents) {
        setFormComponents(data.formComponents)
      }
    }


    
    ws.onclose = () => {
      console.log('WebSocket connection closed')
    }

    return () => {
      ws.close()
    }
  }, [])

  return (
    <div className="">
      <EditorNav/>
      <div className="flex">
        <ComponentPanel/>
        <div className="flex p-5 w-full pb-3">
          <div className="flex w-full h-full justify-center overflow-hidden rounded-xl border-[0.5px] border-gray-300 shadow-lg">
            {formMode === 'edit' && <EditCanvas formComponents={formComponents} />}
            {formMode === 'preview' && <Preview /> }
          </div>
        </div>
      </div>
    </div>
  )
}
