# Real time collaboration poc - Fillout

Fillout with real-time collaboration features.
Aiming to build a simple, single-page editor with scalability in mind.

Built with NextJS, Typescript, Tailwind

## Devlopment Plan:
1. Create some Basic input components first (text, email, number)
    - Add validation
    - Keep in mind, edit and preview/published would have different UIs. For exmaple,
    there would be error message in the preview/published for email input.
    One EmailInput component can be used in the bothe views. 
2. Add inline edit feature
3. Setup State management tool
4. Create Editor area (canvas are and component palette)
5. Add draggable feature
 - Since it's a simple Drag and drop, I'll use HTML APIs
 - Every component have the same hover style, drag and edit pop overs. Make a wrapper component for this.
6. Add components add/delete
7. Add real-time collaboration
    - User presnece indicator
    - Conflict resolution strategy
    - move formComponent state and related CRUD logic to the server
8. Add preview/publish feature

## Backend
#### Centralized State on the WebSocket Server
Single source of truth: Prevents state divergence between clients.
Real-time collaboration: All users see updates instantly and consistently.
Conflict resolution: Easier to manage concurrent edits (server can resolve or reject conflicts).
Persistence: You can save the state to a database from the server

### Conflict handling
Let's use Operational Transform (OT). Here are the reasons:
1. Undo/Redo - we need to track a history of operations
2. Proven method and can handle concurrent edits gracefully
3. Easy to extend - easy to add more operations(e.g adding more editable property or function)

Alternative option is Conflict Free Replicated Data Types (CRDTs),
however, it's too complex for this project (smaller user counts and simple data)

Each operation handles each tasks and we can make transformation logics for each tasks.
Keep in mind that there is no true 'simultaneous', operations arrive at the server in some order. 

## How it works
1. Client maintains operation queue
2. Client make change -> optimistic updates -> send to server
3. Server computes -> broadcast to clients
4. Client reconciles with server resposne

I initially removed optimistic updates, but decided to add again.
It's mainly to give responsive UI updates fast, instead of waiting for the server response
