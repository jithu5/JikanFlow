// src/lib/socket.ts
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const stompClient: Client = new Client({
    brokerURL: undefined, // because we're using SockJS
    webSocketFactory: () => new SockJS("http://localhost:4000/ws"), // ✅ proper factory
    reconnectDelay: 5000, // optional auto-reconnect
    debug: (str) => console.log("[STOMP]", str),
});

export default stompClient;
