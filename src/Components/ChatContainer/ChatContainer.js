import React from 'react';
import ConversationArea from '../ConversationArea/ConversationArea';
import ChatInput from '../ChatInput/ChatInput';

const ChatContainer = () => {
    return(
        <div className="chat-contaier">
            <ConversationArea/>
            <ChatInput/>
        </div>
    );
}

export default ChatContainer;

