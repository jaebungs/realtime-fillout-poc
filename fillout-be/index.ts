import WebSocket, { WebSocketServer } from 'ws'
import { IncomingMessage } from 'http'
import { v4 as uuidv4 } from 'uuid'
import initialFieldAttributes from './utils/initialFieldAttributes'
import { FormComponent } from './types/componentTypes'

const port = 6060

const wss = new WebSocketServer({ port })

const connectedClients = new Set()
const formComponents: FormComponent[] = []

// Handle new connections
wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    const clientId = uuidv4()
    connectedClients.add(clientId)
    console.log(`New client connected from ${clientId}`)
    console.log('All connected client UUIDs:', Array.from(connectedClients))
  
    // Send welcome message to new client
    ws.send(JSON.stringify({
      type: 'welcome',
      message: 'Connected to WebSocket server',
      formComponents,
      timestamp: new Date().toISOString()
    }))
  
    // Handle incoming messages from client
    ws.on('message', (data: WebSocket.RawData) => {
      try {
        const message = JSON.parse(data.toString())
        console.log('Received:', message)
        const order = formComponents.length <= 0 ? 0 : formComponents.length
        
        if (message.type === 'addFormComponent') {
          const initialAttributes = initialFieldAttributes[message.componentName]
          const component: FormComponent = {
            id: uuidv4(),
            order: order,
            componentName: message.componentName, // <-- add this line
            ...initialAttributes
          }
          formComponents.push(component)
        }
        console.log('formComponents', formComponents)
        // Echo the message back to the client
        // ws.send(JSON.stringify({
        //   type: 'echo',
        //   originalMessage: message,
        //   timestamp: new Date().toISOString()
        // }));
  
        // Broadcast to all other connected clients (optional)
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'broadcast',
              message: message,
              formComponents,
              timestamp: new Date().toISOString()
            }));
          }
        });
  
      } catch (error) {
        console.error('Error parsing message:', error)
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid JSON format',
          timestamp: new Date().toISOString()
        }));
      }
    });
  
    // Handle client disconnect
    ws.on('close', (code, reason) => {
      connectedClients.delete(clientId)
      console.log(`Client disconnected. Code: ${code}, Reason: ${reason}`)
      console.log('All connected client UUIDs:', Array.from(connectedClients))
    });
  
    // Handle errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error)
    });
  
    // Send periodic ping to keep connection alive (optional)
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
      } else {
        clearInterval(pingInterval);
      }
    }, 30000); // Ping every 30 seconds
  })
  
  // Handle server errors
  wss.on('error', (error) => {
    console.error('WebSocket Server error:', error)
})