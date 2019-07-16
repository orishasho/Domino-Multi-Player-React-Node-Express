import React from 'react';
import './ActiveUsersList.css';

const ActiveUsersList = ({userNamesList}) => {
    return (
            <ul className ="active-users-list">
                {userNamesList.map(username => <li key={username}>{username}</li>)}
            </ul>
    );
}

export default ActiveUsersList;