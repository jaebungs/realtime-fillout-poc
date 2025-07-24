export let wsInstance: WebSocket

export function createWebSocket() {
    wsInstance = new WebSocket('ws://localhost:6060')
  return wsInstance
}