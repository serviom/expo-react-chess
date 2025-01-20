import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Text, View } from 'react-native';
import { WebsocketContext } from '@/components/WebsocketProvider';

export const Background = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const websocket = useContext(WebsocketContext);

  const connectWebSocket = () => {
    if (websocket && !websocket.connected) {
      websocket.connect();
    }
  };

  const disconnectWebSocket = () => {
    if (websocket && websocket.connected) {
      websocket.disconnect();
    }
  };

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        connectWebSocket();
      } else if (nextAppState.match(/inactive|background/)) {
        disconnectWebSocket();
      }
      setAppState(nextAppState);
    };

    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      //AppState.removeEventListener('change', handleAppStateChange);
      disconnectWebSocket();
    };
  }, [appState]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      disconnectWebSocket();
    };
  }, []);

  return null;
};
