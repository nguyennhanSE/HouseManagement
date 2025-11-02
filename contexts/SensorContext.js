import React, {
  createContext,
  useReducer,
  useMemo,
  useCallback,
  useContext,
  useRef,
  useEffect,
} from 'react';

const SensorContext = createContext({
  readings: [],
  lastUpdated: null,
  isRefreshing: false,
  error: null,
  refreshSensors: () => {},
});

const createInitialReadings = () => {
  const timestamp = new Date().toISOString();
  return [
    { metric: 'temperature', value: 24, unit: '°C', timestamp },
    { metric: 'humidity', value: 68, unit: '%', timestamp },
  ];
};

const initialState = {
  readings: createInitialReadings(),
  lastUpdated: new Date().toISOString(),
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

const randomizeReading = (value, delta) => {
  const variation = (Math.random() * delta * 2 - delta).toFixed(1);
  return Math.max(0, Number(value) + Number(variation));
};

export const SensorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const timeoutRef = useRef(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    []
  );

  const refreshSensors = useCallback(() => {
    if (timeoutRef.current) {
      return;
    }

    dispatch({ type: 'REFRESH_START' });

    timeoutRef.current = setTimeout(() => {
      const shouldFail = Math.random() < 0.15;
      if (shouldFail) {
        dispatch({
          type: 'REFRESH_ERROR',
          payload: 'Unable to retrieve data.',
        });
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
        return;
      }

      const timestamp = new Date().toISOString();
      const readings = state.readings.map((reading) => {
        if (reading.metric === 'temperature') {
          return {
            ...reading,
            value: randomizeReading(reading.value, 0.6),
            timestamp,
          };
        }
        if (reading.metric === 'humidity') {
          return {
            ...reading,
            value: randomizeReading(reading.value, 2),
            timestamp,
          };
        }
        return { ...reading, timestamp };
      });

      dispatch({ type: 'REFRESH_SUCCESS', payload: { readings, timestamp } });
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }, 700);
  }, [state.readings]);

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


