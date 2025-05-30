"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let senderSocket = null;
let receiverSocket = null;
wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    ws.on('message', function message(data) {
        const message = JSON.parse(data);
        if (message.type === "iamsender") {
            senderSocket = ws;
            console.log('sender set');
        }
        else if (message.type === "iamreciever") {
            receiverSocket = ws;
            console.log('receiver set');
        }
        else if (message.type === "createoffer") {
            receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: 'createoffer', sdp: message.sdp }));
            console.log("offer sent");
        }
        else if (message.type === "createanswer") {
            senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: 'createanswer', sdp: message.sdp }));
            console.log("anser sent");
        }
        else if (message.type === "icecandidate") {
            if (ws === senderSocket) {
                receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: 'icecandidate', candidate: message.candidate }));
            }
            else if (ws === receiverSocket) {
                senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: 'icecandidate', candidate: message.candidate }));
            }
        }
    });
    ws.send('something');
});
