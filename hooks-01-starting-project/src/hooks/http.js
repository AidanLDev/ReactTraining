import { useReducer, useCallback } from 'react';

const InitialState = {
  loading: false,
  error: null,
  data: null,
  reqExtra: null,
  identifier: null,
};

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        ...curHttpState,
        loading: true,
        data: null,
        extra: null,
        identifier: action.identifier,
      };
    case 'RESPONSE':
      return {
        ...curHttpState,
        loading: false,
        data: action.resData,
        extra: action.extra,
      };
    case 'ERROR':
      return { error: action.errorMessage, loading: false };
    case 'CLEAR':
      return InitialState;

    default:
      throw new Error('No http case');
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, InitialState);

  const clearError = useCallback(() => dispatchHttp({ type: 'CLEAR' }), []);

  const sendReq = useCallback((url, method, body, reqExtra, reqIdentifier) => {
    dispatchHttp({ type: 'SEND', identifier: reqIdentifier });
    fetch(url, {
      method: method,
      body: body,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        dispatchHttp({ type: 'RESPONSE', resData: res, extra: reqExtra });
      })
      .catch((error) => {
        dispatchHttp({
          type: 'ERROR',
          errorMessage: `Ooops - ${error.message}`,
        });
      });
  }, []);

  return {
    loading: httpState.loading,
    error: httpState.error,
    data: httpState.data,
    sendReq: sendReq,
    reqExtra: httpState.extra,
    identifier: httpState.identifier,
    clear: clearError,
  };
};

export default useHttp;
