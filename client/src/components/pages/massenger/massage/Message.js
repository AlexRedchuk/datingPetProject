import React from 'react';
import './Message.css';

const Message = ({isOwner, text, reference}) => {

    const renderMessage = () => {
        if (isOwner) {
            return <div ref={reference} className="container owner">
                {text}
            </div>
        }
        else {
            return <div ref={reference} className="container other">
                {text}
            </div>
        }
    }

    return <>
        {renderMessage()}
    </>
}
export default Message;