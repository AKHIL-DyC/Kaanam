import { WebSocketServer, WebSocket } from 'ws';


const wss = new WebSocketServer({ port: 8080 });

let senderSocket: null | WebSocket = null;
let receiverSocket: null | WebSocket = null;

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data: any) {
    const message = JSON.parse(data);
    if(message.type ==="iamsender"){
      senderSocket = ws
      console.log('sender set');
    }
    else if(message.type ==="iamreciever"){
      receiverSocket = ws
      console.log('receiver set');
    }
    else if(message.type==="createoffer"){
      receiverSocket?.send(JSON.stringify({type:'createoffer',sdp:message.sdp}))
      console.log("offer sent");
    }
    else if(message.type==="createanswer"){
      senderSocket?.send(JSON.stringify({type:'createanswer',sdp:message.sdp}))
      console.log("anser sent")
    }
    else if(message.type==="icecandidate"){
        if(ws===senderSocket){
          receiverSocket?.send(JSON.stringify({type:'icecandidate',candidate:message.candidate}))
        }
        else if(ws===receiverSocket){
          senderSocket?.send(JSON.stringify({type:'icecandidate',candidate:message.candidate}))
        }

    }
  });



  ws.send('something');
});