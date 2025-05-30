import { useEffect, useState, useRef } from 'react';

const Sender = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'iamsender' }));
    };
    setSocket(ws);
  }, []);

  async function sendVideo() {
    if (!socket) return;

    const pc = new RTCPeerConnection();
    pcRef.current = pc;

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.send(JSON.stringify({ type: 'icecandidate', candidate: event.candidate }));
      }
    };

    // Handle answer from receiver
    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'createanswer') {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      } else if (data.type === 'icecandidate') {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    };

    // Get media and add track before negotiationneeded
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });

    // Trigger offer creation
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.send(JSON.stringify({ type: 'createoffer', sdp: pc.localDescription }));
  }

  return (
    <div>
      <button onClick={sendVideo}>Send Video</button>
    </div>
  );
};

export default Sender;
