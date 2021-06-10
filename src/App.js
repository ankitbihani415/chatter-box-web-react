import './App.css';
import React , {useState, useEffect } from "react";
import socket from './socket.js';

function App() {
  const [state, setState] = useState({
    userName : '',
    msg: '',
    userNameError: null,
    userRegister: false,
    msgList: [],
    alreadyNotified: false,
    notifyList: [],
  });
  useEffect(() => {
    socket.on('userExists', function(data) {
      setState((prevState) =>{
        return {
        ...prevState,
        userNameError:data
      }})
		});
		socket.on('userSet', function(data) {
      setState((prevState) => {
        return {
          ...prevState,
          userRegister:true,
        }
      })
      console.log(`sucessfully register ${data.username}`)
    })

    socket.on('newUserRegister', function(data) {
      setState((prevState) => {
        return {
          ...prevState,
          msgList:prevState.msgList.concat({invite: `${data.username} joins chat`})
        }
      })
    })
    
    socket.on('newmsg',(data) => {
      setState((prevState) => {
        return {
          ...prevState,
          msgList:prevState.msgList.concat(data),
        }
      })
    })

    socket.on('user_left', (data) => {
      setState((prevState) => {
        return {
          ...prevState,
          msgList:prevState.msgList.concat({left: `${data.username} left chat`})
        }
      })
    })

    socket.on('notifyTyping',(data) => {
      setState((prevState) => {
        return {
          ...prevState,
          notifyList: prevState.notifyList.concat(data)
        }
      })
    })

    socket.on('stopTyping', (data) => {
      setState((prevState) => {
        let notifyList = prevState.notifyList
        const index = notifyList.indexOf(data);
        if (index > -1) {
          notifyList.splice(index, 1);
        }
        return {
          ...prevState,
          notifyList: notifyList
        }
      })
    })
  }, []);

  const registerUserName = () => {
    socket.emit('setUsername',state.userName);
  }

  const sendmessage = () => {
    socket.emit('msg',{sender:state.userName,msg:state.msg});
    socket.emit('notTyping',{user:state.userName});
    setState({
      ...state,
      msg:'',
      alreadyNotified: false
    })
  }

  const notifyTypingEvent = () => {
    if(!state.alreadyNotified && state.msg.length > 0){
      socket.emit('typing',{user:state.userName})
      setState({
        ...state,
        alreadyNotified: true
      })
    }
  }

  const notifyStopTypingEvent = (msg) => {
    if(msg.length === 0) {
      debugger
      socket.emit('notTyping',{user:state.userName})
      setState({
        ...state,
        alreadyNotified: false
      })
    }
  }

  return (
    <div className="App">
      { 
        !state.userRegister &&
        <>
          <input 
            type="text" 
            placeholder="enter your name" 
            name="userName" 
            value={state.userName}
            onChange={(e) => setState({
              ...state,
              userNameError:null,
              userName:e.target.value
            })}
          />
          {state.userNameError && <span>{state.userNameError}</span>}
          <button
            type="button"
            name="register"
            onClick={registerUserName}
          >
            Register
          </button>
        </>
      }
      {
        state.userRegister && 
        <>
          <input 
            type="text" 
            placeholder="type your message" 
            name="msg" 
            value={state.msg}
            onChange={(e) => {
              setState({
                ...state,
                msg:e.target.value
              })
              notifyStopTypingEvent(e.target.value)
            }}
            onKeyUp={notifyTypingEvent}
          />
          <button
            type="button"
            name="sendmessage"
            onClick={sendmessage}
          >
            Send
          </button>
          <ul>
          {
            state.notifyList.length > 0 &&
            state.notifyList.map((notify, index) => {
              return (
                <li key={index}>
                  {
                    `${notify} is typing`
                  }
                </li>
              )
            })  
          }
          </ul>
          <ul>
          {
            state.msgList.length > 0 &&
            state.msgList.map((msg, index) => {
              return (
                <li key={index}>
                  { 
                    msg.sender && msg.msg &&
                    `${msg.sender} send message = ${msg.msg}`
                  }
                  {
                    msg.invite && msg.invite
                  }
                  {
                    msg.left && msg.left
                  }
                </li>
              )
            })  
          }
          </ul>
        </>
      }
    </div>
  );
}

export default App;
