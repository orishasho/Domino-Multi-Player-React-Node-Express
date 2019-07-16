import React from 'react';
import './LogoutBtn.css';

const LogoutBtn = ({logoutHandler}) => {
    return(
        <button type="button" className="btn" onClick={logoutHandler}>
            <span>Log out</span>
        </button>
    );
}

export default LogoutBtn;