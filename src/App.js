import React , {useState, useEffect } from "react";
import socket from './socket.js';
import './App.css';
import RecentChat from './RecentChat';
import UserRow from './UserRow';
import OutgoingMessage from './OutgoingMessage';
import IncomingMessage from './IncomingMessage';
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const App = () => {
    const [state, setState] = useState({
        userName : '',
        msg: '',
        userNameError: null,
        userRegister: false,
        msgList: [],
        alreadyNotified: false,
        notifyList: [],
		userList:[],
		whichActive:"user_list",
		chatList:[0,1,2,3,4,5]
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
		  socket.emit('user_list');
          console.log(`sucessfully register ${data.username}`)
        })
    
        socket.on('newUserRegister', function(data) {
            setState((prevState) => {
                let userList = prevState.userList;
                userList.push(data.user)
                console.log('userList',userList)
                return {
                    ...prevState,
                    userList:userList
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

		socket.on('get_user_list',(data) => {
            let d = JSON.parse(data)
            console.log('get_user_list',d)
			setState((prevState) => {
				return {
					...prevState,
					userList:d
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
	const showSection =(section) => {
		setState({
			...state,
			whichActive:section
		})
	}
    console.log(44444,state.userList)
    return (
        <div className="container">
            { 
            !state.userRegister &&
            <div className="overlay">
                <div className="ui-panel login-panel animated bounceInDown">
                    <header>
                        <div className="left logo">
                            <a href="#logo"><span>Chatter</span>Box</a>
                        </div>
                    </header>
                    <div className="login-form">
                        <div className="subtitle">Login or register</div>
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
                        {/* <input type="text" placeholder="Password" /> */}
                    </div>
                    
                    {state.userNameError && <span>{state.userNameError}</span>}
                    <footer>
                        {/* <div className="left social-login">
                            Login with 
                            <i className="fa fa-fw fa-twitter"></i>
                            <i className="fa fa-fw fa-facebook"></i>
                            <i className="fa fa-fw fa-google-plus"></i>
                        </div> */}
                        
                        <div className="right form-actions">
                            <Button
                                type="button"
                                name="register"
                                onClick={registerUserName}
                                className="ui-button inactive register"
                            >
                                Register
                            </Button>
                            {/* <a href="#login" className="ui-button inactive login">Login</a>
                            <a href="#register" className="ui-button inactive register">Register</a> */}
                        </div>
                    </footer>
                </div>
            </div>
            }
            {
                state.userRegister &&
                <>
                    <h3 className="text-center">Welcome {state.userName}</h3>
                    <div className="messaging">
                        <div className="inbox_msg">
                            <div className="inbox_people">
                                <div className="headind_srch">
                                    <div className="recent_heading">
                                        <span className={state.whichActive === "user_list" ? "active-btn btn btn-link" : "btn btn-link"} onClick={() => showSection('user_list')}>User List</span>
                                        <span className={state.whichActive === "chat_list" ? "active-btn btn btn-link" : "btn btn-link"} onClick={() => showSection('chat_list')}>Chat</span>
                                    </div>
                                    <div className="srch_bar">
                                        <div className="stylish-input-group">
                                            <input type="text" className="search-bar" placeholder="Search" />
                                            <span className="input-group-addon">
                                                <button type="button">
                                                <i className="fa fa-search" aria-hidden="true"></i>
                                                </button>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="inbox_chat">
                                    {
                                        state.whichActive === "user_list" && 
										state.userList.map((user, index) => {
                                            return user.username !== state.userName 
                                            ?
                                                <UserRow
                                                    key={index}
													user={user} 
                                                />
                                            :
                                                null
                                        })
                                    }
									{
                                        state.whichActive === "chat_list" && 
										state.chatList.map((chat, index) => {
                                            return (
                                                <RecentChat
                                                    key={index}
                                                />
                                            )
                                        })
                                    }    
                                </div>
                            </div>
                            <div className="mesgs">
                                <div className="msg_history">
                                    {
                                        state.msgList.length > 0 &&
                                        state.msgList.map((msg, index) => {
                                            return (
                                                <>
                                                    { 
                                                        msg.sender === state.userName 
                                                        ?
                                                        <OutgoingMessage
                                                            key={index}
                                                            msg={msg} 
                                                        />
                                                        :
                                                        <IncomingMessage
                                                            key={index}
                                                            msg={msg}
                                                        />
                                                    }
                                                </>
                                            )
                                        })
                                    }
                                </div>
                                <div className="type_msg">
                                    <div className="input_msg_write">
                                        <input
                                            type="text"
                                            className="write_msg"
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
                                        <Button 
                                            className="msg_send_btn" 
                                            type="button"
                                            name="sendmessage"
                                            onClick={sendmessage}
                                        >
                                            <FontAwesomeIcon icon={faPaperPlane} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default App