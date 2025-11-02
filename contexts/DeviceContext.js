import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react';

import { mockRooms } from '../data/rooms';

const DeviceContext = createContext({
  rooms: [],
  lastUpdated: null,
  toggleDevice: () => {},
  setLightLevel: () => {},
  updateDevice: () => {},
});

const createInitialRooms = () =>
  mockRooms.map((room) => ({
    ...room,
    devices: Object.entries(room.devices || {}).reduce((acc, [key, value]) => {
      acc[key] = { ...value };
      return acc;
    }, {}),
  }));

const initialState = {
  rooms: createInitialRooms().map((room) => ({
    ...room,
    devices: Object.entries(room.devices).reduce((acc, [key, value]) => {
      acc[key] = {
        ...value,
        lastSync: Date.now(),
        isStale: false,
      };
      return acc;
    }, {}),
  })),
  lastUpdated: Date.now(),
};

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_DEVICE': {
      const { roomId, deviceKey, isOn } = action.payload;
      const now = Date.now();
      const rooms = state.rooms.map((room) => {
        if (room.id !== roomId) return room;
        const device = room.devices[deviceKey];
        if (!device) return room;
        return {
          ...room,
          devices: {
            ...room.devices,
            [deviceKey]: {
              ...device,
              isOn,
              lastSync: now,
              isStale: false,
            },
          },
        };
      });
      return { rooms, lastUpdated: now };
    }
    case 'SET_LIGHT_LEVEL': {
      const { roomId, level } = action.payload;
      const now = Date.now();
      const rooms = state.rooms.map((room) => {
        if (room.id !== roomId) return room;
        const light = room.devices.light;
        if (!light) return room;
        return {
          ...room,
          devices: {
            ...room.devices,
            light: {
              ...light,
              level: Math.max(0, Math.min(100, level)),
              lastSync: now,
              isStale: false,
            },
          },
        };
      });
      return { rooms, lastUpdated: now };
    }
    case 'UPDATE_DEVICE': {
      const { roomId, deviceKey, updates } = action.payload;
      const now = Date.now();
      const rooms = state.rooms.map((room) => {
        if (room.id !== roomId) return room;
        const device = room.devices[deviceKey];
        if (!device) return room;
        return {
          ...room,
          devices: {
            ...room.devices,
            [deviceKey]: {
              ...device,
              ...updates,
              lastSync: updates.lastSync !== undefined ? updates.lastSync : now,
            },
          },
        };
      });
      return { rooms, lastUpdated: now };
    }
    case 'CHECK_STALE_STATUS': {
      const now = Date.now();
      const staleThreshold = 2000;
      const rooms = state.rooms.map((room) => {
        const devices = Object.entries(room.devices).reduce((acc, [key, device]) => {
          const isStale = device.lastSync && now - device.lastSync > staleThreshold;
          acc[key] = {
            ...device,
            isStale,
          };
          return acc;
        }, {});
        return { ...room, devices };
      });
      return { ...state, rooms };
    }
    default:
      return state;
  }
}

export const DeviceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  React.useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'CHECK_STALE_STATUS' });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleDevice = useCallback((roomId, deviceKey, isOn) => {
    dispatch({ type: 'TOGGLE_DEVICE', payload: { roomId, deviceKey, isOn } });
  }, []);

  const setLightLevel = useCallback((roomId, level) => {
    dispatch({ type: 'SET_LIGHT_LEVEL', payload: { roomId, level } });
  }, []);

  const updateDevice = useCallback((roomId, deviceKey, updates) => {
    dispatch({ type: 'UPDATE_DEVICE', payload: { roomId, deviceKey, updates } });
  }, []);

  const value = useMemo(
    () => ({
      rooms: state.rooms,
      lastUpdated: state.lastUpdated,
      toggleDevice,
      setLightLevel,
      updateDevice,
    }),
    [state.rooms, state.lastUpdated, toggleDevice, setLightLevel, updateDevice]
  );

  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
};

export const useDevices = () => useContext(DeviceContext);


