import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const DeviceContext = createContext({
  rooms: [],
  devices: [],
  lastUpdated: null,
  isLoading: false,
  error: null,
  toggleDevice: () => {},
  setLightLevel: () => {},
  updateDevice: () => {},
  refreshDevices: () => {},
  refreshRooms: () => {},
});

const initialState = {
  rooms: [],
  devices: [],
  lastUpdated: null,
  isLoading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_ROOMS_SUCCESS':
      return {
        ...state,
        rooms: action.payload,
        lastUpdated: Date.now(),
        isLoading: false,
        error: null,
      };
    case 'FETCH_DEVICES_SUCCESS':
      return {
        ...state,
        devices: action.payload,
        isLoading: false,
        error: null,
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'TOGGLE_DEVICE': {
      // Optimistic update - device state will be refreshed from API
      return { ...state, lastUpdated: Date.now() };
    }
    case 'SET_LIGHT_LEVEL': {
      // Optimistic update - device state will be refreshed from API
      return { ...state, lastUpdated: Date.now() };
    }
    case 'UPDATE_DEVICE': {
      // Optimistic update - device state will be refreshed from API
      return { ...state, lastUpdated: Date.now() };
    }
    default:
      return state;
  }
}

// Helper function to map devices to rooms structure
const mapDevicesToRooms = (rooms, devices) => {
  return rooms.map((room) => {
    const roomDevices = devices.filter((d) => d.roomId === room.id);
    const devicesMap = {};
    
    roomDevices.forEach((device) => {
      const deviceKey = device.type === 'light' ? 'light' : device.type === 'fan' ? 'fan' : device.type;
      const currentState = device.currentState || 'off';
      const isOn = currentState === 'on' || parseInt(currentState) > 0;
      
      if (device.type === 'light') {
        devicesMap.light = {
          isOn,
          level: isOn && parseInt(currentState) ? parseInt(currentState) : isOn ? 75 : 0,
          lastSync: device.updatedAt ? new Date(device.updatedAt).getTime() : Date.now(),
          isStale: false,
        };
      } else if (device.type === 'fan') {
        devicesMap.fan = {
          isOn,
          speed: isOn && parseInt(currentState) ? `${currentState}%` : 'Medium',
          lastSync: device.updatedAt ? new Date(device.updatedAt).getTime() : Date.now(),
          isStale: false,
        };
      } else {
        devicesMap[deviceKey] = {
          isOn,
          lastSync: device.updatedAt ? new Date(device.updatedAt).getTime() : Date.now(),
          isStale: false,
        };
      }
    });

    return {
      ...room,
      devices: devicesMap,
    };
  });
};

export const DeviceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isAuthenticated } = useAuth();

  const fetchRooms = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      dispatch({ type: 'FETCH_START' });
      const rooms = await api.getRooms();
      dispatch({ type: 'FETCH_ROOMS_SUCCESS', payload: rooms });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
    }
  }, [isAuthenticated]);

  const fetchDevices = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const devices = await api.getDevices();
      dispatch({ type: 'FETCH_DEVICES_SUCCESS', payload: devices });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
    }
  }, [isAuthenticated]);

  const refreshDevices = useCallback(async () => {
    await fetchDevices();
  }, [fetchDevices]);

  const refreshRooms = useCallback(async () => {
    await fetchRooms();
  }, [fetchRooms]);

  // Fetch rooms and devices on mount and when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchRooms();
      fetchDevices();
    }
  }, [isAuthenticated, fetchRooms, fetchDevices]);

  // Refresh devices periodically
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const interval = setInterval(() => {
      fetchDevices();
    }, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchDevices]);

  const toggleDevice = useCallback(async (roomId, deviceKey, isOn) => {
    try {
      // Map device key to API device identifier
      let deviceId = deviceKey;
      if (deviceKey === 'light') {
        deviceId = 'lamp';
      }
      
      const action = isOn ? 'on' : 'off';
      await api.controlDevice(deviceId, action);
      
      dispatch({ type: 'TOGGLE_DEVICE', payload: { roomId, deviceKey, isOn } });
      
      // Refresh device state after update
      setTimeout(() => fetchDevices(), 500);
    } catch (error) {
      console.error('Toggle device error:', error);
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
    }
  }, [fetchDevices]);

  const setLightLevel = useCallback(async (roomId, level) => {
    try {
      await api.controlDevice('lamp', 'value', level.toString());
      dispatch({ type: 'SET_LIGHT_LEVEL', payload: { roomId, level } });
      
      // Refresh device state after update
      setTimeout(() => fetchDevices(), 500);
    } catch (error) {
      console.error('Set light level error:', error);
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
    }
  }, [fetchDevices]);

  const updateDevice = useCallback((roomId, deviceKey, updates) => {
    dispatch({ type: 'UPDATE_DEVICE', payload: { roomId, deviceKey, updates } });
  }, []);

  // Merge devices into rooms structure
  const roomsWithDevices = useMemo(() => {
    return mapDevicesToRooms(state.rooms, state.devices);
  }, [state.rooms, state.devices]);

  const value = useMemo(
    () => ({
      rooms: roomsWithDevices,
      devices: state.devices,
      lastUpdated: state.lastUpdated,
      isLoading: state.isLoading,
      error: state.error,
      toggleDevice,
      setLightLevel,
      updateDevice,
      refreshDevices,
      refreshRooms,
    }),
    [roomsWithDevices, state.devices, state.lastUpdated, state.isLoading, state.error, toggleDevice, setLightLevel, updateDevice, refreshDevices, refreshRooms]
  );

  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
};

export const useDevices = () => useContext(DeviceContext);


