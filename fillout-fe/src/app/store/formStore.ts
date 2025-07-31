import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { FormMode } from "@/app/types/formMode";
import { FormComponent, PendingOperation } from "@/app/types/formComponent";
import { wsInstance } from "@/app/utils/websocket";
import initialFieldAttributes from "@/app/utils/initialFieldAttributes";
import { v4 as uuidv4 } from "uuid";

interface FormStore {
  userId: string;
  formComponents: FormComponent[];
  pendingOperation: PendingOperation[];
  formMode: FormMode;
  selectedComponent: FormComponent | null;
  updateFormComponents: (newFormComponents: FormComponent[]) => void;
  changeFormMode: (mode: FormMode) => void;
  addFormComponent: (
    name: keyof typeof initialFieldAttributes,
    order: number
  ) => void;
  addFormComponentAtPosition: (
    name: keyof typeof initialFieldAttributes,
    position: number
  ) => void;
  changeFormOrder: (
    draggedComponent: FormComponent,
    dropTargetComponent: FormComponent
  ) => void;
  removeFormComponent: (form: FormComponent) => void;
  selectComponent: (component: FormComponent | null) => void;
  clearSelectedComponent: () => void;
  updateComponentProperty: (
    componentId: string,
    property: keyof FormComponent,
    value: any
  ) => void;
  setUserId: (userId: string) => void;
  reconcileWithBackend: (
    backendFormComponents: FormComponent[],
    confirmedOpId: string | null
  ) => void;
}

// Helper to apply a single operation to formComponents
function applyOpToFormComponents(formComponents: FormComponent[], op: PendingOperation) : FormComponent[] {
  switch (op.type) {
    case "addFormComponent": {
      const exists = formComponents.some((c) => c.id === op.payload.id);
      if (exists) return formComponents;
      return [...formComponents, op.payload].sort((a, b) => a.order - b.order);
    }

    case "addFormComponentAtPosition": {
      const exists = formComponents.some((c) => c.id === op.payload.id);
      if (exists) return formComponents;

      const newArr = [...formComponents];
      newArr.splice(op.payload.order, 0, op.payload);
      return newArr.map((c, i) => ({ ...c, order: i }));
    }

    case "removeFormComponent": {
      return formComponents
        .filter((c) => c.id !== op.payload.formToRemove.id)
        .map((c, i) => ({ ...c, order: i }));
    }

    case "changeFormOrder": {
      const { draggedComponent, dropTargetComponent } = op.payload;
      const filtered = formComponents.filter(
        (c) => c.id !== draggedComponent.id
      );
      filtered.splice(dropTargetComponent.order, 0, { ...draggedComponent });
      return filtered.map((c, i) => ({ ...c, order: i }));
    }

    case "updateComponentProperty": {
      const { componentId, property, value } = op.payload;
      return formComponents.map((c) =>
        c.id === componentId ? { ...c, [property]: value } : c
      );
    }

    default:
      return formComponents;
  }
}

// Helper to create a form component
function createFormComponent(
  name: keyof typeof initialFieldAttributes,
  order: number
): FormComponent {
  return {
    id: uuidv4(),
    order,
    componentName: name,
    ...initialFieldAttributes[name],
  };
}

// Helper to send WebSocket message with error handling
function sendWebSocketMessage(message: any) {
  try {
    if (wsInstance.readyState === WebSocket.OPEN) {
      wsInstance.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not open. Message not sent:", message);
    }
  } catch (error) {
    console.error("Failed to send WebSocket message:", error);
  }
}

// Helper to add pending operation
function addPendingOperation(
  state: FormStore,
  operationId: string,
  type: PendingOperation["type"],
  payload: any
): PendingOperation {
  const operation: PendingOperation = {
    id: operationId,
    userId: state.userId,
    payload,
    type,
    timestamp: Date.now(),
  };

  // Create new array instead of mutating
  state.pendingOperation = [...state.pendingOperation, operation];
  return operation;
}

export const useFormStore = create<FormStore>()(
  devtools(
    (set, get) => ({
      userId: "",
      formComponents: [],
      pendingOperation: [],
      formMode: "edit",
      selectedComponent: null,

      setUserId: (userId: string) => set({ userId }),

      updateFormComponents: (newFormComponents: FormComponent[]) =>
        set({ formComponents: newFormComponents }),

      changeFormMode: (mode: FormMode) => set({ formMode: mode }),

      selectComponent: (component: FormComponent | null) =>
        set({ selectedComponent: component }),

      clearSelectedComponent: () => set({ selectedComponent: null }),

      addFormComponent: (name, order) =>
        set((state) => {
          const component = createFormComponent(name, order);
          const operationId = component.id;

          // Add pending operation
          const pendingOp = addPendingOperation(
            state,
            operationId,
            "addFormComponent",
            component
          );

          // Apply the operation to get new state (this ensures consistency with reconciliation)
          const newFormComponents = applyOpToFormComponents(
            state.formComponents,
            pendingOp
          );

          // Send WebSocket message
          sendWebSocketMessage({
            operationId,
            type: "addFormComponent",
            userId: state.userId,
            componentName: name,
            order: "last",
            timestamp: Date.now(),
          });

          return { formComponents: newFormComponents };
        }),

      addFormComponentAtPosition: (name, position) =>
        set((state) => {
          const component = createFormComponent(name, position);
          const operationId = component.id;

          // Add pending operation
          const pendingOp = addPendingOperation(
            state,
            operationId,
            "addFormComponentAtPosition",
            component
          );

          // Apply the operation to get new state (this ensures consistency with reconciliation)
          const newFormComponents = applyOpToFormComponents(
            state.formComponents,
            pendingOp
          );

          // Send WebSocket message
          sendWebSocketMessage({
            operationId,
            type: "addFormComponentAtPosition",
            userId: state.userId,
            componentName: name,
            order: position,
            timestamp: Date.now(),
          });

          return { formComponents: newFormComponents };
        }),

      changeFormOrder: (draggedComponent, dropTargetComponent) =>
        set((state) => {
          if (
            !draggedComponent ||
            draggedComponent.order === dropTargetComponent.order
          ) {
            return state;
          }

          const operationId = uuidv4();
          const payload = { draggedComponent, dropTargetComponent };

          // Add pending operation
          const pendingOp = addPendingOperation(
            state,
            operationId,
            "changeFormOrder",
            payload
          );

          // Apply the operation to get new state
          const newFormComponents = applyOpToFormComponents(
            state.formComponents,
            pendingOp
          );

          // Send WebSocket message
          sendWebSocketMessage({
            operationId,
            type: "changeFormOrder",
            userId: state.userId,
            draggedComponent,
            dropTargetComponent,
            timestamp: Date.now(),
          });

          return { formComponents: newFormComponents };
        }),

      removeFormComponent: (form) =>
        set((state) => {
          const operationId = uuidv4();
          const payload = { formToRemove: form };

          // Add pending operation
          const pendingOp = addPendingOperation(
            state,
            operationId,
            "removeFormComponent",
            payload
          );

          // Apply the operation to get new state
          const newFormComponents = applyOpToFormComponents(
            state.formComponents,
            pendingOp
          );

          // Send WebSocket message
          sendWebSocketMessage({
            operationId,
            type: "removeFormComponent",
            userId: state.userId,
            targetComponent: form,
            timestamp: Date.now(),
          });

          return {
            formComponents: newFormComponents,
            selectedComponent: null,
          };
        }),

      updateComponentProperty: (componentId, property, value) =>
        set((state) => {
          const operationId = uuidv4();
          const payload = { componentId, property, value };

          // Add pending operation
          const pendingOp = addPendingOperation(
            state,
            operationId,
            "updateComponentProperty",
            payload
          );

          // Apply the operation to get new state
          const newFormComponents = applyOpToFormComponents(
            state.formComponents,
            pendingOp
          );

          // Send WebSocket message
          sendWebSocketMessage({
            operationId,
            type: "updateComponentProperty",
            userId: state.userId,
            componentId,
            property,
            value,
            timestamp: Date.now(),
          });

          return { formComponents: newFormComponents };
        }),

      reconcileWithBackend: (
        backendFormComponents: FormComponent[],
        confirmedOpId: string | null
      ) => {
        set((state) => {
          // Remove confirmed operation from pending operations FIRST
          let newPending = confirmedOpId
            ? state.pendingOperation.filter((op) => {
                const shouldRemove = op.id === confirmedOpId;
                return !shouldRemove;
              })
            : state.pendingOperation;

          // Start with the backend state as the source of truth
          let reconciledComponents = [...backendFormComponents];

          // Apply all remaining pending operations in order
          for (const op of newPending.sort(
            (a, b) => a.timestamp - b.timestamp
          )) {
            reconciledComponents = applyOpToFormComponents(
              reconciledComponents,
              op
            );
          }

          // Update selected component if it no longer exists or has changed
          const selectedComponent = state.selectedComponent;
          let newSelectedComponent = null;

          if (selectedComponent) {
            const updatedSelected = reconciledComponents.find(
              (c) => c.id === selectedComponent.id
            );
            newSelectedComponent = updatedSelected || null;
          }

          return {
            formComponents: reconciledComponents,
            pendingOperation: newPending,
            selectedComponent: newSelectedComponent,
          };
        });
      },
    }),
    {
      name: "form-store",
    }
  )
);
