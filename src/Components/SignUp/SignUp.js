import React from 'react';
import './SignUp.css';

const SignUp = ({handleSignUp, errorMessage}) => {
    return (
        <div className="signup-page-wrapper">
            <h1>Welcome to Multi Player Domino!</h1>
            <h2>To start playing, please sign up to the system:</h2>
            <form onSubmit={handleSignUp}>
                <label className="username-label" htmlFor="userName"> Username: </label>
                <input className="username-input" name="userName"/>                        
                <input className="submit-btn btn" type="submit" value="Sign up!"/>
            </form>
            <div className="signup-error-message">
                {errorMessage}
            </div>
        </div>
    );
}

export default SignUp;