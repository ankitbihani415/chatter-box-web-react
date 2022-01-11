import React from 'react'

const UserRow = (props) => {
    console.log('UserRow',props)
    return (
        <div className="user_list">
            <div className="chat_img">
                <img
                    src="https://ptetutorials.com/images/user-profile.png"
                    alt="ankit"
                />
            </div>
            <div className="user_ib">
                <h5>{props.user.username} <span className="chat_date">Joined at Dec 25</span></h5>
            </div>
        </div>
    )
}

export default UserRow;