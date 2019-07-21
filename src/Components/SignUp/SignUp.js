import React from 'react';
import './SignUp.css';

const SignUp = ({handleSignUp, errorMessage}) => {
    return (
        <div className="header">
                <div className="signup-page-wrapper">
                    <h1 className="heading-primary">
                        <span className="heading-primary-main">Multiplayer Domino</span>
                        <span className="heading-primary-sub">Let the fun begin</span>
                    </h1>
                    <h2 className="signup-msg">To start playing, please sign up to the system:</h2>
                    <form onSubmit={handleSignUp}>
                        <label className="username-label" htmlFor="userName"> Username: </label>
                        <input className="username-input" name="userName"/>                        
                        <input className="signup-submit-btn btn" type="submit" value="Sign up!"/>
                    </form>
                    <div className="signup-error-message">
                        {errorMessage}
                    </div>
            </div>
        </div>

    );
}

export default SignUp;
