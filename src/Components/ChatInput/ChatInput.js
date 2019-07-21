import React, {Component} from 'react';

export default class ChatInput extends Component {
    constructor() {
        super();        
        this.state = {
            sendInProgress:false
        };
        this.sendText = this.sendText.bind(this);
    }

    render() {               
        return(
            <form className="chat-input-wrapper" onSubmit={this.sendText}>
                <input disabled={this.state.sendInProgress} placeholder="enter text here" ref={input => this.inputElement = input} />
                <input type="submit" className="btn" disabled={this.state.sendInProgress} value="Send" />
            </form>
        );
    }   

    sendText(e) {
        e.preventDefault();
        this.setState(()=>({sendInProgress: true}));
        const msg = this.inputElement.value;
        fetch(`/chat/${this.props.gameIndex}`, {
            method: 'POST',
            body: msg,
            credentials: 'include'
        })
        .then(res => {            
            if (!res.ok) {                
                throw res;
            }
            this.setState(()=>({sendInProgress: false}));
            this.inputElement.value = '';                
        });
        return false;
    }
}