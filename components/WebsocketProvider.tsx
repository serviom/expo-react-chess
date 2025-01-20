import React, { createContext, useEffect, useRef } from 'react';
import { io, Manager, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { StateType, useAppDispatch } from '@app/features/store';
import WebsocketSlice from '@app/features/notifications/websocketSlice';
import dialogSlice from '@/features/dialog/dialogSlice';
import { EventNameType, WsDialogNewMessageData, WsDialogTypingData } from '@app/types';

export const WebsocketContext = createContext<Socket | null>(null);
const typingTimers: Record<string, NodeJS.Timeout> = {};

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { tokens } = useSelector((state: StateType) => state.auth);
  const socketRef = useRef<any | null>(null);

  useEffect(() => {
    const manager = new Manager(process.env.EXPO_PUBLIC_WS_HOST, {
      path: '/socket.io',
      transports: ['websocket'],
      extraHeaders: {
        Cookie: 'Bearer ' + tokens.access_token,
      },
    });

    socketRef.current = manager.socket('/application');
    socketRef.current.on('connect', async () => {
      console.log('WS connected');
      dispatch(WebsocketSlice.actions.connected());
    });

    socketRef.current.on('message', (event: WsDialogNewMessageData | WsDialogTypingData) => {
      console.log('ws message', event);
      if (event.event == 'dialog.typing') {
        const key = `${event.dialogId}-${event.userId}`;
        dispatch(dialogSlice.actions.dialogTyping(event));

        if (typingTimers[key]) {
          clearTimeout(typingTimers[key]);
        }

        typingTimers[key] = setTimeout(() => {
          dispatch(dialogSlice.actions.dialogTypingStop(event));
        }, 5000);
      }
      if (event.event == 'dialog.newMessage') {
        dispatch(dialogSlice.actions.dialogNewMessage(event));
      }
      ///dispatch(WebsocketSlice.actions.connected());
    });

    socketRef.current.on('data', (payload: any) => {
      console.log('ws data', payload);
      ///dispatch(WebsocketSlice.actions.connected());
    });

    socketRef.current.on('error', (e: any) => {
      console.log('error', e);
      dispatch(WebsocketSlice.actions.error(e));
    });
    socketRef.current.on('reconnect', () => {
      console.log('WS reconnect');
    });
    socketRef.current.on('reconnect_attempt', (attempt: number) => {
      console.log('WS reconnect_attempt', attempt);
    });
    socketRef.current.on('reconnect_error', (e: any) => {
      console.log('WS reconnect_error', e);
    });
    socketRef.current.on('reconnect_failed', (e: any) => {
      console.log('WS reconnect_failed', e);
    });
    socketRef.current.on('disconnect', (e: any) => {
      console.log('WS disconnect');
      console.log(e.code, e.reason);
      dispatch(WebsocketSlice.actions.disconnected(e));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [tokens]);

  return <WebsocketContext.Provider value={socketRef.current}>{children}</WebsocketContext.Provider>;
};
