import React from 'react'

export default function IncomingMessage(props) {
    return (
        <>
            { props.msg.msg ? 
            <div>
                <div className="incoming_msg">
                    <div className="incoming_msg_img">
                    <img
                        src="https://ptetutorials.com/images/user-profile.png"
                        alt={props.msg.sender}
                    />
                    </div>
                    <div className="received_msg">
                    <div className="received_withd_msg">
                        <p>{props.msg.msg}</p>
                        <span className="time_date"> 11:01 AM | June 9 | {props.msg.sender} </span>
                    </div>
                    </div>
                </div>
            </div>
            :
            <></>
            }
        </>
    )
}
