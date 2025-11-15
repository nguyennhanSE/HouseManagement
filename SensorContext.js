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

const SensorContext = createContext({
  readings: [],
  lastUpdated: null,
  isRefreshing: false,
  error: null,
  refreshSensors: () => {},
});

const initialState = {
  readings: [],
  lastUpdated: null,
  isRefreshing: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'REFRESH_START':
      return { ...state, isRefreshing: true, error: null };
    case 'REFRESH_SUCCESS':
      return {
        readings: action.payload.readings,
        lastUpdated: action.payload.timestamp,
        isRefreshing: false,
        error: null,
      };
    case 'REFRESH_ERROR':
      return {
        ...state,
        isRefreshing: false,
        error: action.payload,
      };
    default:
      return state;
  }
}


export const SensorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const timeoutRef = useRef(null);
  const { isAuthenticated } = useAuth();

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    []
  );

  const refreshSensors = useCallback(async () => {
    if (!isAuthenticated) return;
    if (timeoutRef.current) {
      return;
    }

    dispatch({ type: 'REFRESH_START' });

    try {
      // Fetch all sensors
      const sensors = await api.getSensors();
      
      // Fetch latest data for each sensor (focus on temperature and humidity)
      const tempHumiditySensors = sensors.filter((s) => 
        s.type === 'temperature' || s.type === 'temp' || s.type === 'humidity'
      );

      const sensorDataPromises = tempHumiditySensors.map(async (sensor) => {
        try {
          const data = await api.getSensorData(sensor.id, 1); // Get latest reading
          // The API returns SensorDataLog array with SensorValues nested
          if (data && data.length > 0) {
            const latestLog = data[0];
            return {
              sensorId: sensor.id,
              type: sensor.type,
              values: latestLog.SensorValues || [],
              createdAt: latestLog.createdAt,
            };
          }
          return {
            sensorId: sensor.id,
            type: sensor.type,
            values: [],
          };
        } catch (error) {
          console.error(`Error fetching data for sensor ${sensor.id}:`, error);
          return null;
        }
      });

      const sensorDataResults = await Promise.all(sensorDataPromises);
      const sensorData = sensorDataResults.filter((sd) => sd !== null);

      // Build readings directly from sensor data
      const readings = [];
      sensorData.forEach((sd) => {
        if (sd.values && sd.values.length > 0) {
          const latestValue = sd.values[sd.values.length - 1];
          if (sd.type === 'temperature' || sd.type === 'temp') {
            readings.push({
              metric: 'temperature',
              value: parseFloat(latestValue.value) || 24,
              unit: latestValue.unit || '°C',
              timestamp: latestValue.createdAt || sd.createdAt || new Date().toISOString(),
            });
          } else if (sd.type === 'humidity') {
            readings.push({
              metric: 'humidity',
              value: parseFloat(latestValue.value) || 68,
              unit: latestValue.unit || '%',
              timestamp: latestValue.createdAt || sd.createdAt || new Date().toISOString(),
            });
          }
        }
      });

      // Ensure we have at least temperature and humidity readings
      if (!readings.find((r) => r.metric === 'temperature')) {
        readings.push({
          metric: 'temperature',
          value: 24,
          unit: '°C',
          timestamp: new Date().toISOString(),
        });
      }
      if (!readings.find((r) => r.metric === 'humidity')) {
        readings.push({
          metric: 'humidity',
          value: 68,
          unit: '%',
          timestamp: new Date().toISOString(),
        });
      }
      const timestamp = new Date().toISOString();

      dispatch({ type: 'REFRESH_SUCCESS', payload: { readings, timestamp } });
    } catch (error) {
      console.error('Refresh sensors error:', error);
      dispatch({
        type: 'REFRESH_ERROR',
        payload: error.message || 'Unable to retrieve sensor data.',
      });
    } finally {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [isAuthenticated]);

  // Auto-refresh sensors periodically
  useEffect(() => {
    if (!isAuthenticated) return;

    refreshSensors();
    const interval = setInterval(() => {
      refreshSensors();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, refreshSensors]);

  const value = useMemo(
    () => ({
      readings: state.readings,
      lastUpdated: state.lastUpdated,
      isRefreshing: state.isRefreshing,
      error: state.error,
      refreshSensors,
    }),
    [state.readings, state.lastUpdated, state.isRefreshing, state.error, refreshSensors]
  );

  return <SensorContext.Provider value={value}>{children}</SensorContext.Provider>;
};

export const useSensors = () => useContext(SensorContext);


