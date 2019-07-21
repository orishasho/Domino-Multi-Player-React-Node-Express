import React, {Component} from 'react';
const _ = require('lodash');

export default class ConversationArea extends Component {
    constructor() {
        super();
        this.state = {
            content: []
        };        
        this.getChatContent = this.getChatContent.bind(this);
    }

    componentDidMount() {
        this.getChatContent();
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    render() {
        if (this.state.content && this.state.content.length > 0) {
            return(
                <div className="conversation-area-wrpper">
                    {this.state.content.map((line, index) => {
                        return (<p key={line.user.name + index}>{line.user.name}: {line.text}</p>);
                    })}
                </div>
            );
        }
        else {
            return null;
        }
    }

    getChatContent() {
        return fetch(`/chat`, {method: 'GET', credentials: 'include'})
        .then((res) => {
            if (!res.ok){
                throw res;
            }
            this.timeoutId = setTimeout(this.getChatContent, 200);
            return res.json();    
        })
        .then(allChatsContents => {
            console.log(allChatsContents[this.props.gameIndex]);
            this.setState(()=>({content: _.cloneDeep(allChatsContents[this.props.gameIndex])}));
        })
        .catch(err => {throw err});
    }
}