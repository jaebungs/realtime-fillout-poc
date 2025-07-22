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
8. Add preview/publish feature