import React, { createContext, useContext, useReducer, useMemo, useCallback, useRef, useEffect } from 'react';

const ConnectionContext = createContext({
  status: 'connected',
  retries: 0,
  lastError: null,
  nextRetryIn: null,
  retry: () => {},
});

const initialState = {
  status: 'connected',
  retries: 0,
  lastError: null,
  nextRetryIn: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'CONNECTION_CHANGED':
      return {
        ...state,
        status: action.payload.status,
        lastError: action.payload.error || null,
        retries: action.payload.status === 'disconnected' ? state.retries + 1 : 0,
      };
    case 'RETRY_SCHEDULED':
      return {
        ...state,
        nextRetryIn: action.payload.seconds,
      };
    case 'RETRY_CLEARED':
      return {
        ...state,
        nextRetryIn: null,
      };
    default:
      return state;
  }
}

export const ConnectionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const retryTimeoutRef = useRef(null);
  const retryIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      if (retryIntervalRef.current) clearInterval(retryIntervalRef.current);
    };
  }, []);

  const scheduleRetry = useCallback((attemptNumber) => {
    const baseDelay = 1000;
    const backoffDelay = Math.min(baseDelay * Math.pow(2, attemptNumber), 30000);
    const retryInSeconds = Math.ceil(backoffDelay / 1000);

    let secondsRemaining = retryInSeconds;
    dispatch({ type: 'RETRY_SCHEDULED', payload: { seconds: secondsRemaining } });

    retryIntervalRef.current = setInterval(() => {
      secondsRemaining -= 1;
      if (secondsRemaining > 0) {
        dispatch({ type: 'RETRY_SCHEDULED', payload: { seconds: secondsRemaining } });
      } else {
        clearInterval(retryIntervalRef.current);
        retryIntervalRef.current = null;
      }
    }, 1000);

    retryTimeoutRef.current = setTimeout(() => {
      dispatch({ type: 'RETRY_CLEARED' });
      clearInterval(retryIntervalRef.current);
      retryIntervalRef.current = null;
    }, backoffDelay);
  }, []);

  const retry = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    if (retryIntervalRef.current) {
      clearInterval(retryIntervalRef.current);
    }
    dispatch({ type: 'RETRY_CLEARED' });
    scheduleRetry(state.retries);
  }, [state.retries, scheduleRetry]);

  const value = useMemo(
    () => ({
      status: state.status,
      retries: state.retries,
      lastError: state.lastError,
      nextRetryIn: state.nextRetryIn,
      retry,
    }),
    [state.status, state.retries, state.lastError, state.nextRetryIn, retry]
  );

  return (
    <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>
  );
};

export const useConnection = () => useContext(ConnectionContext);


