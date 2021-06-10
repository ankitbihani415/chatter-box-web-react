import { io }  from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:3001";
const socket = io(ENDPOINT, { transports: ['websocket'] });

socket.on('connect',function(data){
    console.log('connect => ',data)
    // alert(data)
})
socket.on("connect_error", (error) => {
    console.log('connect_error => ',error)
    // alert(error)
});
socket.on('disconnect',function(data){
    console.log('disconnect => ',data)
    // alert(data)
})

export default socket;