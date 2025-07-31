import { act } from '@testing-library/react';
import { useFormStore } from '@/app/store/formStore'; // Update this path if needed
import { wsInstance } from '@/app/utils/websocket';

// === Mock UUID ===
jest.mock('uuid', () => ({
  v4: jest.fn(() => `mock-id-${Math.random().toString(36).substr(2, 5)}`),
}));

// === Mock WebSocket instance ===
jest.mock('@/app/utils/websocket', () => {
  const mockSend = jest.fn();
  const mockWebSocket = {
    readyState: 1, // WebSocket.OPEN
    send: mockSend,
  };
  return {
    wsInstance: mockWebSocket,
    createWebSocket: jest.fn(() => mockWebSocket),
  };
});

describe('Concurrent form component addition', () => {
  beforeEach(() => {
    // Reset Zustand state
    useFormStore.setState({
      userId: '',
      formComponents: [],
      pendingOperation: [],
      formMode: 'edit',
      selectedComponent: null,
    });
  });

  test('3 users concurrently add components', async () => {
    const userIds = ['user-1', 'user-2', 'user-3'];

    // Each "user" adds a component
    const simulateUserAdd = async (userId: string, index: number) => {
      const store = useFormStore;
      act(() => {
        store.getState().setUserId(userId);
        store.getState().addFormComponent('ShortAnswerInput', index);
      });
    };

    // Simulate 3 users concurrently adding components
    await Promise.all([
      simulateUserAdd(userIds[0], 0),
      simulateUserAdd(userIds[1], 1),
      simulateUserAdd(userIds[2], 2),
    ]);

    const components = useFormStore.getState().formComponents;

    // Check all 3 components are added
    expect(components.length).toBe(3);
    expect(components.map((c) => c.componentName)).toEqual([
      'ShortAnswerInput',
      'ShortAnswerInput',
      'ShortAnswerInput',
    ]);

    // Check that send was called for each operation
    expect(wsInstance.send).toHaveBeenCalledTimes(3);

    components.forEach((component) => {
      expect(wsInstance.send).toHaveBeenCalledWith(
        expect.stringContaining(component.id)
      );
    });
  });
});