import { nanoid } from "nanoid";

type MessageType = "error";
type Callback = (message: any) => any;

type RequestCallback = (body: any) => any;

export default class SocketClient {
    private connection: WebSocket;
    private callbacks: Map<MessageType, Callback>;
    private requests: Map<string, RequestCallback>;

    public onConnected: () => any;

    constructor() {
        this.requests = new Map();
        this.callbacks = new Map();
        this.connection = new WebSocket("ws://localhost:3101/");

        this.onConnected = () => {};

        this.connection.onopen = () => {
            this.send({
                type: "handshake"
            });
        };

        this.connection.onmessage = msg => {
            const message = JSON.parse(msg.data);

            console.log("New message: ", message);

            switch (message.type) {
                case "response":
                    let request = this.requests.get(message.responseId);
                    if (request == null) {
                        console.error("Invalid response id");
                    } else request(message.responseBody);
                    break;

                case "authorization":
                    if (message.successful) this.onConnected();
                    else console.error("Connection error");
                    break;

                default:
                    let callback = this.callbacks.get(message.type);
            
                    if (callback != null) {
                        callback(message);
                    }
                    break;
            }
        };
    }

    request(method: string, options: {
        params?: any;
        callback: RequestCallback
    }) {
        const requestId = nanoid(5);
        this.send({
            type: "request",
            requestId: requestId,
            requestBody: options.params,
            method: method
        });

        this.requests.set(requestId, options.callback);
    }

    send(data: any) {
        this.connection.send(JSON.stringify(data));
    }

    on(type: MessageType, callback: Callback) {
        this.callbacks.set(type, callback);
    }
}