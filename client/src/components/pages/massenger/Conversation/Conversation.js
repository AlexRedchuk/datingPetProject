import React, {useEffect, useState} from 'react';
import { connect } from 'react-redux';
import datingBase from '../../../../APIs/datingBase'
import _ from 'lodash';
import './Conversation.scss'

const Conversation = ({conversation, userId, active, onSetActive, socket, messages, onlineUsers, activeConv}) => {
    const [convUser, setConvUser] = useState({});
    const [lastMessage, setLastMessage] = useState({})
    const friendId = conversation.members.find(m => m !== userId);
    async function getUser() {
        
        const res = await datingBase.get(`/api/users/${friendId}`)
        const message = await datingBase.get(`/api/messages/lastMessage/${conversation._id}`)
        setConvUser(res.data);
        if(active === 'active') {
            setLastMessage(message.data ? {...message.data, isRead: true} : {});
        }
        else {
            setLastMessage(message.data);
        }
    }
   
    useEffect(()=> {
        getUser();
    }, [conversation, userId, messages])

    useEffect(() => {
         function getMsgs() {
             socket?.on("getMessage",  data => {
                if(data.sender === friendId) {
                    setLastMessage(data)
                }
            })
        }
        getMsgs();
    }, [socket])

    if(_.isEmpty(convUser)) {
        return <></>
    }

    const renderReadStatus = () => {
        if(lastMessage?.isRead || _.isEmpty(lastMessage) || lastMessage.sender === userId) {
            return <></>
        }
        else {
            console.log(lastMessage)
            return <div className="read_status"></div>
        }
    }

    const renderOnline = () => {
        if(onlineUsers.some(el => el.userId === friendId)) {
            return  <div className="online_status"></div>
        }
        else {
            return  <></>
        }
    } 
    const renderLastMessageText = () => {
        return (lastMessage.sender === userId) ? "Ви: " + lastMessage.text : lastMessage.text;
    }
    return ( <div onClick={onSetActive} className={`conversation_block ${active}`}>
    <div className="conversation_avatar_block">
        <img className="conversation_avatar" src={convUser.photos[0]} alt="no data"/>
        {renderOnline()}
    </div>
    <div className="conversation_info">
        <div className="interlocutor_name">{convUser.name}</div>
        <div className="interlocutor_last_msg">{_.isEmpty(lastMessage) ? "Немає повідомлень" : 
         renderLastMessageText()}</div>
    </div>
    {renderReadStatus()}
</div>)
}

const mapStateToProps = (state, ownProps) => {
    return {
        userId: state.auth.userId,
        socket: state.auth.socket,
        messages: state.messages.messages,
        onlineUsers: state.auth.onlineUsers,
        activeConv: state.messages.activeConversation,
        conversation: ownProps.conversation,
        active: ownProps.active,
        onSetActive: ownProps.onSetActive
    }
}

export default connect(mapStateToProps)(Conversation);