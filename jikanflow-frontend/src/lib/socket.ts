import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient: Client | null = null;
let isConnected = false;

const token = JSON.parse(localStorage.getItem("token") || '""')?.replace(/^"|"$/g, '');
console.log("Token being sent to WS:", token);

export function getStompClient() {
    if (!stompClient) {
        stompClient = new Client({
            
            webSocketFactory: () => new SockJS(`http://localhost:4000/ws?token=${token}`),
            reconnectDelay: 5000,
            debug: (str) => console.log("[STOMP]", str),
            onConnect: () => {
                console.log("🟢 STOMP connected");
                isConnected = true;
            },
            onDisconnect: () => {
                console.log("🔴 STOMP disconnected");
                isConnected = false;
            },
            onStompError: (err) => {
                console.error("STOMP Error", err);
                isConnected = false;
            },
        });

        stompClient.activate();
    }

    return stompClient;
}

export function isStompConnected() {
    return isConnected;
}
