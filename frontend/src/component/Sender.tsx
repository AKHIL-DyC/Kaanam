import {useEffect, useState} from 'react'

const Sender = () => {
  const[socket,setsocket]=useState<WebSocket|null>(null);
  useEffect(()=>{
    const socket=new WebSocket('ws://localhost:8080')
    socket.onopen=()=>{
      socket.send(JSON.stringify({type:"iamsender"}))
    }
  },[])
  async function sendvideo(){
      const pc=new RTCPeerConnection()
      const offer=await pc.createOffer()
      await pc.setLocalDescription(offer)
      socket?.send(JSON.stringify({type:'createoffer',sdp:pc.localDescription}))
  }
  return (
    <div>
      <button onClick={sendvideo}></button>
    </div>
  )
}

export default Sender