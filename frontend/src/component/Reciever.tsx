import {useEffect} from 'react'

const Reciever = () => {
    useEffect(()=>{
        const socket=new WebSocket('ws://localhost:8080')
        socket.onopen=()=>{
          socket.send(JSON.stringify({type:"iamreciever"}))
        }
      },[])
  return (
    <div>Reciever</div>
  )
}

export default Reciever