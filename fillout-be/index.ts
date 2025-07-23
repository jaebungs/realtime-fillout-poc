import WebSocket, { WebSocketServer } from 'ws'
import { IncomingMessage } from 'http'
import { v4 as uuidv4 } from 'uuid'
import initialFieldAttributes from './utils/initialFieldAttributes'
import { FormComponent } from './types/componentTypes'

const port = 6060

const wss = new WebSocketServer({ port })

const connectedClients = new Set()
let formComponents: FormComponent[] = []

function addFormComponent(componentName: string) {
  const order = formComponents.length
  const initialAttributes = initialFieldAttributes[componentName]
  const component: FormComponent = {
    id: uuidv4(),
    order,
    componentName,
    ...initialAttributes,
  };
  formComponents.push(component)
}

function addFormComponentAtPosition(componentName: string, order: number) {
  const initialAttributes = initialFieldAttributes[componentName]
  const component: FormComponent = {
    id: uuidv4(),
    order,
    componentName,
    ...initialAttributes,
  };
  const newFormComponents: FormComponent[] = [...formComponents]
  newFormComponents.splice(order, 0, component)
  // Update the order of all components after the insertion point
  for (let i = order + 1; i < newFormComponents.length; i++) {
    newFormComponents[i].order = i
  }
  formComponents = newFormComponents
}

function changeFormOrder(draggedComponent: FormComponent, dropTargetComponent: FormComponent) {
  const draggedIndex = draggedComponent.order
  const dropIndex = dropTargetComponent.order
  if (draggedIndex === -1 || dropIndex === -1) return

  const newFormComponents = [...formComponents]
  const [moved] = newFormComponents.splice(draggedIndex, 1)
  newFormComponents.splice(dropIndex, 0, moved)

  // update order only for the affected form components
  const start = Math.min(draggedIndex, dropIndex)
  const end = Math.max(draggedIndex, dropIndex)

  for (let i = start; i <= end; i++) {
    newFormComponents[i].order = i;
  }

  formComponents = newFormComponents
}

function removeFormComponent(targetComponent: FormComponent) {
  const newFormComponents = formComponents.filter(form => form.id !== targetComponent.id)
  for (let i = targetComponent.order; i < newFormComponents.length; i++) {
    newFormComponents[i].order = i
  }

  formComponents = newFormComponents
}

function broadcastFormComponents(message: any) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: 'broadcast',
          message,
          formComponents,
          timestamp: new Date().toISOString(),
        })
      )
    }
  })
}

// Handle new connections
wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
  const clientId = uuidv4();
  connectedClients.add(clientId);
  console.log(`New client connected from ${clientId}`);
  console.log('All connected client UUIDs:', Array.from(connectedClients));

  // Send welcome message to new client - init
  ws.send(
    JSON.stringify({
      type: 'welcome',
      message: 'Connected to WebSocket server',
      formComponents,
      timestamp: new Date().toISOString(),
    })
  )

  // Handle incoming messages from client
  ws.on('message', (data: WebSocket.RawData) => {
    try {
      const message = JSON.parse(data.toString())
      console.log('Received:', message);

      if (message.type === 'addFormComponent') {
        addFormComponent(message.componentName)
      } else if (message.type === 'addFormComponentAtPosition') {
        addFormComponentAtPosition(message.componentName, message.order)
      } else if (message.type === 'changeFormOrder') {
        changeFormOrder(message.draggedComponent, message.dropTargetComponent)
      } else if (message.type === 'removeFormComponent') {
        removeFormComponent(message.targetComponent)
      }
      console.log('formComponents', formComponents)

      // Broadcast to all clients
      broadcastFormComponents(message);
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
    connectedClients.delete(clientId);
    console.log(`Client disconnected. Code: ${code}, Reason: ${reason}`)
    console.log('All connected client UUIDs:', Array.from(connectedClients))
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error)
  })

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