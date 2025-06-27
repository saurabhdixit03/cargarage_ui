import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;

export const connectWebSocket = (onMessageReceived) => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS('http://localhost:8080/ws-status'), // ✅ matches backend
    debug: (str) => {
      // console.log(str);
    },
    reconnectDelay: 5000,
    onConnect: () => {
      stompClient.subscribe('/booking-status/update', (message) => {
        const body = JSON.parse(message.body);
        onMessageReceived(body); // ✅ passes message back to frontend
      });
    },
    onStompError: (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Details: ' + frame.body);
    },
  });

  stompClient.activate(); // ✅ starts connection
};

export const disconnectWebSocket = () => {
  if (stompClient !== null) {
    stompClient.deactivate(); // ✅ clean disconnect
  }
};
