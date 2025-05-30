import { useEffect, useRef } from 'react';

const Receiver = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    let pc: RTCPeerConnection | null = null;
    const remoteStream = new MediaStream();

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'iamreciever' }));
    };

    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'createoffer') {
        pc = new RTCPeerConnection();

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.send(JSON.stringify({ type: 'icecandidate', candidate: event.candidate }));
          }
        };

        pc.ontrack = (event) => {
          remoteStream.addTrack(event.track);
          if (videoRef.current) {
            videoRef.current.srcObject = remoteStream;
          }
        };

        await pc.setRemoteDescription(new RTCSessionDescription(message.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.send(JSON.stringify({ type: 'createanswer', sdp: pc.localDescription }));
      } else if (message.type === 'icecandidate' && pc) {
        await pc.addIceCandidate(new RTCIceCandidate(message.candidate));
      }
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline controls />
    </div>
  );
};

export default Receiver;
