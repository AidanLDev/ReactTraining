import { useReducer, useCallback } from 'react';

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { ...curHttpState, loading: true };
    case 'RESPONSE':
      return { ...curHttpState, loading: false, data: action.resData };
    case 'ERROR':
      return { error: action.errorMessage, loading: false };
    case 'CLEAR':
      return { ...curHttpState, error: null };
    default:
      throw new Error('No http case');
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
    data: null,
  });

  const sendReq = useCallback((url, method, body) => {
    dispatchHttp({ type: 'SEND' });
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
        dispatchHttp({ type: 'RESPONSE', resData: res });
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
  };
};

export default useHttp;
