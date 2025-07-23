'use client'
import { useState, useEffect, useRef } from 'react'
import { useFormStore } from '@/app/store/formStore'
import { createWebSocket } from '@/app/utils/websocket'
import EditorNav from '@/app/components/EditorNav'
import ComponentPanel from '@/app/components/ComponentPanel'
import EditCanvas from '@/app/components/EditCanvas'
import Preview from '@/app/components/Preview'

export default function Home() {
  const formMode = useFormStore(state => state.formMode)
  const [formComponents, setFormComponents] = useState([])
  const [isLoading, setLoading] = useState(true)
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    ws.current = createWebSocket()
    const wsInstance = ws.current
    if (!wsInstance) return;
    
    wsInstance.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data)
      if (data.type === 'welcome' && data.formComponents) {
        setFormComponents(data.formComponents)
      }
      if (data.type === 'broadcast' && data.formComponents) {
        setFormComponents(data.formComponents)
      }
    }
    wsInstance.onclose = () => {
      console.log('WebSocket connection closed')
    }
    setLoading(false)
    return () => {
      if (wsInstance) wsInstance.close()
    }
  }, [])

  return (
    <div className="">
      <EditorNav/>
      {ws.current && <div className="flex">
        <ComponentPanel wsInstance={ws.current} />
        <div className="flex p-5 w-full pb-3">
          <div className="flex w-full h-full justify-center overflow-hidden rounded-xl border-[0.5px] border-gray-300 shadow-lg">
            {formMode === 'edit' && <EditCanvas formComponents={formComponents} wsInstance={ws.current}/>} 
            {formMode === 'preview' && <Preview /> }
          </div>
        </div>
      </div>}
      {isLoading && <div>Loading...</div>}
      {!ws.current && !isLoading && <div>Error! Websocket not available.</div>}
    </div>
  )
}
