# Real time collaboration poc - Fillout

/fillout-fe - Frontend
/fillout-be - Backend
npm install
npm run dev

Fillout with real-time collaboration features.
Aiming to build a simple, single-page editor with scalability in mind.

Built with NextJS, Typescript, Tailwind

## Devlopment Plan:
1. Create some Basic input components first (text, email, number) (V)
    - Add validation
    - Keep in mind, edit and preview/published would have different UIs. For exmaple,
    there would be error message in the preview/published for email input.
    One EmailInput component can be used in the bothe views. 
2. Add inline edit feature (V)
3. Setup State management tool (V)
4. Create Editor area (canvas are and component palette) (V)
5. Add draggable feature (V)
 - Since it's a simple Drag and drop, I'll use HTML APIs
 - Every component have the same hover style, drag and edit pop overs. Make a wrapper component for this.
6. Add components add/delete (V)
7. Add real-time collaboration
    - User presnece indicator (X)
    - Conflict resolution strategy (V) 
    - move formComponent state and related CRUD logic to the server (V)
8. Add preview/publish feature (V/X)

## Backend
#### Centralized State on the WebSocket Server
Single source of truth: Prevents state divergence between clients.
Real-time collaboration: All users see updates instantly and consistently.
Conflict resolution: Easier to manage concurrent edits (server can resolve or reject conflicts).
Persistence: You can save the state to a database from the server

### Conflict handling
Operational Transform is a technique to maintain consistency in a collaborative editing system.
When two users perform simultaneously, OT transforms one operation based on the other to ensure all clients end up with the same final state.

Let's use Operational Transform (OT). Here are the reasons:
1. Undo/Redo - we need to track a history of operations (Not implemented here, but future feature in case)
2. Proven method and can handle concurrent edits gracefully
3. Easy to extend - easy to add more operations(e.g adding more editable property or function)

Alternative option is Conflict Free Replicated Data Types (CRDTs),
however, it's too complex for this project (smaller user counts and simple data)

Each operation handles each tasks and we can make transformation logics for each tasks.
Keep in mind that there is no true 'simultaneous', operations arrive at the server in some order. 

### Detailed Example: Concurrent Add Operations in the BE
The initial state:
formComponents = [
  { id: "comp-1", order: 0, componentName: "TextField" },
  { id: "comp-2", order: 1, componentName: "Button" },
  { id: "comp-3", order: 2, componentName: "Checkbox" }
]

#### Senario 1:
User A (timestamp: 1000): Adds "DatePicker" at position 1
User B (timestamp: 1001): Adds "RadioButton" at position 1

1. User A's operation process directly since no operation to transform.
=> formComponents = [
  { id: "comp-1", order: 0, componentName: "TextField" },
  { id: "comp-4", order: 1, componentName: "DatePicker" },  // New
  { id: "comp-2", order: 2, componentName: "Button" },      // Order shifted
  { id: "comp-3", order: 3, componentName: "Checkbox" }     // Order shifted
]

2. User B's operation process
Operation B timestamp (1001) > Operation A timestamp (1000)
Must transform Operation B against Operation A
Calls transformAddVsAdd(operationA, operationB)
transformedOperationB is created with the correct order proeprty (Transformed from 1 to 2)
=> formComponents = [
  { id: "comp-1", order: 0, componentName: "TextField" },
  { id: "comp-4", order: 1, componentName: "DatePicker" },   // User A's addition
  { id: "comp-5", order: 2, componentName: "RadioButton" },  // User B's addition (transformed)
  { id: "comp-2", order: 3, componentName: "Button" },
  { id: "comp-3", order: 4, componentName: "Checkbox" }
]


### Some thoughts
- Keep in mind that FE updates optimistically to give instant update UX instead of waiting for BE
- Why change browser default foucs styling? e.g. input foucs style
- My development plan was not in order, however, worked as a good todo list.
- Conflict handling is confusing tbh. I designed it assuming the concurrent user is less than a dozen.
  It'll work well with a few users.
- Used Playwright to simulate real concurrent addition. Cypress cannot support multiple browser, thus, Playwright