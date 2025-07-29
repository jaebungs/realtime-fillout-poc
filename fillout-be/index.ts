// server.ts
import WebSocket, { WebSocketServer } from 'ws'
import { IncomingMessage } from 'http'
import { v4 as uuidv4 } from 'uuid'
import { OTEngine } from './ot/engine'
import { Operation } from './ot/types'
import { FormComponent } from './types/componentTypes'

const port = 6060

const wss = new WebSocketServer({ port })
const connectedClients = new Map<string, WebSocket>()

// Initialize OT engine with state change callback
function onStateChangeFn(components: FormComponent[], operation: Operation) {
  broadcastOperation(components, operation)
}
const otEngine = new OTEngine(onStateChangeFn)

function broadcastOperation( formComponents: FormComponent[], operation: Operation) {
  const message = {
    type: 'operationApplied',
    operation,
    formComponents,
    sequenceNumber: otEngine.getSequenceNumber(),
    timestamp: new Date().toISOString(),
  }
  console.log('broadcastOperation', message)
  connectedClients.forEach((client, userId) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message))
    }
  })
}

// Handle new connections
wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
  const userId = uuidv4()
  connectedClients.set(userId, ws)
  console.log(`New client connected: ${userId}`)

  // Send welcome message with current state
  ws.send(
    JSON.stringify({
      type: 'welcome',
      message: 'Connected to WebSocket server',
      formComponents: otEngine.getFormComponents(),
      userId,
      sequenceNumber: otEngine.getSequenceNumber(),
      timestamp: new Date().toISOString(),
    })
  )

  // Handle incoming messages
  ws.on('message', (data: WebSocket.RawData) => {
    try {
      const message = JSON.parse(data.toString())
      console.log('Received:', message)

      // Convert message to operation and process with OT
      const operation = OTEngine.createOperationFromMessage(message)
      const success = otEngine.processOperation(operation)
      
      if (!success) {
        ws.send(
          JSON.stringify({
            type: 'operationRejected',
            message: 'Operation could not be applied',
            operation,
            timestamp: new Date().toISOString(),
          })
        )
      }
      
    } catch (error) {
      console.error('Error parsing message:', error)
      ws.send(
        JSON.stringify({
          type: 'error',
          message: 'Invalid JSON format',
          timestamp: new Date().toISOString(),
        })
      )
    }
  })

  // Handle client disconnect
  ws.on('close', (code, reason) => {
    connectedClients.delete(userId)
    console.log(`Client disconnected: ${userId}. Code: ${code}, Reason: ${reason}`)
  })

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error)
  })

  // Keep connection alive
  const pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping()
    } else {
      clearInterval(pingInterval)
    }
  }, 30000)
})

// Handle server errors
wss.on('error', (error) => {
  console.error('WebSocket Server error:', error)
})

console.log(`WebSocket server running on port ${port}`)

export { otEngine, connectedClients }