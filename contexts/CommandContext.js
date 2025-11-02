import React, {
  createContext,
  useReducer,
  useMemo,
  useCallback,
  useContext,
  useRef,
  useEffect,
} from 'react';

const CommandContext = createContext({
  history: [],
  pending: [],
  executeCommand: async () => ({ status: 'pending' }),
  clearHistory: () => {},
});

const initialState = {
  history: [],
  pending: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'QUEUE_COMMAND': {
      const nextHistory = [action.payload, ...state.history].slice(0, 20);
      return {
        history: nextHistory,
        pending: [...state.pending, action.payload.id],
      };
    }
    case 'RESOLVE_COMMAND': {
      const { id, status, ackAt, error } = action.payload;
      return {
        history: state.history.map((cmd) =>
          cmd.id === id ? { ...cmd, status, ackAt, error } : cmd
        ),
        pending: state.pending.filter((pendingId) => pendingId !== id),
      };
    }
    case 'CLEAR_HISTORY':
      return {
        history: [],
        pending: [],
      };
    default:
      return state;
  }
}

const createCommandId = () => `${Date.now()}-${Math.round(Math.random() * 100000)}`;

export const CommandProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const timeoutsRef = useRef(new Set());

  useEffect(
    () => () => {
      timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutsRef.current.clear();
    },
    []
  );

  const executeCommand = useCallback(async ({ type, deviceId, payload }) => {
    const command = {
      id: createCommandId(),
      type,
      deviceId,
      payload,
      status: 'pending',
      issuedAt: new Date().toISOString(),
    };

    dispatch({ type: 'QUEUE_COMMAND', payload: command });

    const timeoutId = setTimeout(() => {
      const shouldFail = Math.random() < 0.1;
      dispatch({
        type: 'RESOLVE_COMMAND',
        payload: {
          id: command.id,
          status: shouldFail ? 'error' : 'acknowledged',
          ackAt: new Date().toISOString(),
          error: shouldFail ? 'Command failed: Device not responding' : null,
        },
      });
      timeoutsRef.current.delete(timeoutId);
    }, 600);

    timeoutsRef.current.add(timeoutId);

    return { status: 'pending', id: command.id };
  }, []);

  const clearHistory = useCallback(() => {
    timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    timeoutsRef.current.clear();
    dispatch({ type: 'CLEAR_HISTORY' });
  }, []);

  const value = useMemo(
    () => ({
      history: state.history,
      pending: state.pending,
      executeCommand,
      clearHistory,
    }),
    [state.history, state.pending, executeCommand, clearHistory]
  );

  return <CommandContext.Provider value={value}>{children}</CommandContext.Provider>;
};

export const useCommands = () => useContext(CommandContext);


