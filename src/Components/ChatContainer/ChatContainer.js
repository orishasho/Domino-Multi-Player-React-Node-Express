import React from 'react';
import ConversationArea from '../ConversationArea/ConversationArea';
import ChatInput from '../ChatInput/ChatInput';

const ChatContainer = ({gameIndex}) => {
    return(
        <div className="chat-contaier">
            <ConversationArea gameIndex={gameIndex}/>
            <ChatInput gameIndex={gameIndex}/>
        </div>
    );
}

export default ChatContainer;

