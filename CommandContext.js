import React, {
  createContext,
  useReducer,
  useMemo,
  useCallback,
  useContext,
  useRef,
  useEffect,
} from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

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

// Helper to map command type to API device/action
const mapCommandToAPI = (type, deviceId, payload) => {
  // Parse deviceId format: "roomId:deviceKey" or "device:simulated"
  const parts = deviceId.split(':');
  let device = parts[1] || parts[0];
  let action = 'on';
  let value = null;

  if (type === 'ToggleDeviceCommand') {
    action = payload?.state === 'on' ? 'on' : 'off';
  } else if (type === 'AdjustLightLevelCommand') {
    device = 'lamp';
    action = 'value';
    value = payload?.level?.toString();
  } else if (type === 'ToggleSceneCommand' || type === 'ToggleRoutineCommand') {
    // These are handled separately in automation API
    return { type: 'scene', scene: parts[1] || parts[0], action: payload?.state };
  } else if (type === 'ActivateSecuritySceneCommand') {
    return { type: 'scene', scene: 'movie', action: 'on' };
  }

  // Map device keys to API identifiers
  if (device === 'light') {
    device = 'lamp';
  }

  return { device, action, value };
};

export const CommandProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isAuthenticated } = useAuth();

  const executeCommand = useCallback(async ({ type, deviceId, payload }) => {
    if (!isAuthenticated) {
      return { status: 'error', error: 'Not authenticated' };
    }

    const command = {
      id: createCommandId(),
      type,
      deviceId,
      payload,
      status: 'pending',
      issuedAt: new Date().toISOString(),
    };

    dispatch({ type: 'QUEUE_COMMAND', payload: command });

    try {
      const apiParams = mapCommandToAPI(type, deviceId, payload);

      if (apiParams.type === 'scene') {
        // Handle automation scenes
        await api.runScene(apiParams.scene === 'good-morning' ? 'goodmorning' : apiParams.scene);
      } else {
        // Handle device commands
        await api.controlDevice(apiParams.device, apiParams.action, apiParams.value);
      }

      dispatch({
        type: 'RESOLVE_COMMAND',
        payload: {
          id: command.id,
          status: 'acknowledged',
          ackAt: new Date().toISOString(),
          error: null,
        },
      });

      return { status: 'acknowledged', id: command.id };
    } catch (error) {
      console.error('Execute command error:', error);
      dispatch({
        type: 'RESOLVE_COMMAND',
        payload: {
          id: command.id,
          status: 'error',
          ackAt: new Date().toISOString(),
          error: error.message || 'Command failed',
        },
      });

      return { status: 'error', id: command.id, error: error.message };
    }
  }, [isAuthenticated]);

  const clearHistory = useCallback(() => {
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


