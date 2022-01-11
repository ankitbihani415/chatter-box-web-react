import React from 'react'

export default function OutgoingMessage (props){
    return (
        <div className="outgoing_msg">
            <div className="sent_msg">
            <p>{props.msg.msg}</p>
            <span className="time_date"> 11:01 AM | June 9</span>
            </div>
        </div>
    )
}
