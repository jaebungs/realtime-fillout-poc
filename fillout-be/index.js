const WebSocket = require('ws')
const { v4: uuidv4 } = require('uuid')

const port = 6060;

const wss = new WebSocket.Server({ port })

const connectedClients = new Set()

// Handle new connections
wss.on('connection', (ws, req) => {
    const clientId = uuidv4()
    connectedClients.add(clientId)
    console.log(`New client connected from ${clientId}`)
    console.log('All connected client UUIDs:', Array.from(connectedClients))
  
    // Send welcome message to new client
    ws.send(JSON.stringify({
      type: 'welcome',
      message: 'Connected to WebSocket server',
      timestamp: new Date().toISOString()
    }));
  
    // Handle incoming messages from client
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString())
        console.log('Received:', message)
  
        // Echo the message back to the client
        ws.send(JSON.stringify({
          type: 'echo',
          originalMessage: message,
          timestamp: new Date().toISOString()
        }));
  
        // Broadcast to all other connected clients (optional)
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'broadcast',
              message: message,
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