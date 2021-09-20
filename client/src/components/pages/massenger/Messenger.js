import React, { useEffect, useRef} from 'react';
import './Messenger.css';
import line from '../../imgs/Line Long.png'
import { ReactComponent as More } from '../../svg/more.svg'
import { ReactComponent as Verified } from '../../svg/Verified.svg'

import Message from './massage/Message';
import { connect } from 'react-redux';
import { getConversations, getConversationUser, getMessages, sendArrivalMessage, sendMessage, setActiveConversation } from '../../../actions/messageActions';
import Conversation from './Conversation/Conversation';
import _ from 'lodash';
import MessageForm from './Conversation/MessageForm';


function Massenger({  conversations, getMessages, messages, user, getConversationUser, convUser, activeConv , 
    setActiveConversation, sendMessage, sendArrivalMessage, socket, onlineUsers}) {
    const scrollRef = useRef();

    const scrollToBottom = () => {
        scrollRef.current?.scrollIntoView();
    }
    useEffect(() => {

        if(!_.isEmpty(activeConv)) {
            onConversationClick(activeConv)
        }
    }, [])
    useEffect(() => {
       
        scrollToBottom();
    }, [messages])

    useEffect(() => {
        async function getMsgs() {
            await socket?.on("getMessage", async data => {
                await sendArrivalMessage(data)
            })
        }
        getMsgs()
    }, [socket])

   
    if (!conversations || !messages) {
        return <div>Loading...</div>
    }

    if (conversations.length === 0) {
        return <div className="user_card_loading">
        <span>У вас немає повідомлень...</span>
    </div>
    }
    const onConversationClick = async (conv) => {
        await getMessages(conv._id);
        await getConversationUser(conv.members.find(m => m !== user._id))
        setActiveConversation(conv);
        scrollToBottom();
    }

    const sendForm = async (formValues) => {
        await sendMessage({
            conversationId: activeConv._id,
            sender: user._id,
            text: formValues.text
        })
    }
    const renderOnline = (id) => {
        if(onlineUsers.some(el => el.userId === id)) {
            return  <div className="online_text">Онлайн</div>
        }
        else {
            return  <div style={{
                paddingTop: '23px'
            }}></div>
        }
    }

    const renderDialog = () => {
        if(_.isEmpty(activeConv) || _.isEmpty(convUser)) {
            return <div key={activeConv._id} className="dialog_empty"></div>
        }
        else {
            return (<div key={activeConv._id} className="dialog_container">
            <div className="user_info_block">
                <div className="user_info_justify">
                <img className="user_avatar" src={convUser.photos[0]} alt="no data"/>
                    <div className="user_info">
                        <div className="name_block">
                            <div className="name">{convUser?.name}</div>
                            <Verified className="verified_svg" />
                        </div>
                       {renderOnline(convUser._id)}

                    </div>
                </div>
                <More className="more_button" />
            </div>
            <img className="long_line" src={line} alt="line" />
            <div className="messages_container">
                <div className="starting_message">
                    <img className="starting_message_avatar" src={convUser.photos[0]} alt="no data"/>
                    <div className="about_container">
                        <div className="about_label">Про мене:</div>
                        <div className="about_text">Працюю в Галактичному сенаті </div>
                        <div className="about_text">Підтримую повстанців</div>
                        <div className="about_text">Допомогла зі знищенням «Зірки смерті»</div>
                    </div>
                </div>
                <div className="messages">
                    {messages.map(m => {
                        return (
                                <Message reference={scrollRef}  key={m._id} isOwner={m.sender === user._id} text={m.text} />)

                        
                    })}
                </div>
            </div>
            <MessageForm onSubmit={sendForm}/>
        </div>)
        }
    }

    

    return (
        <div className="main_container">
            <div className="conversations_container">
                {conversations.map((conv, i) => {
                    return <Conversation key={conv._id} active={conv._id === activeConv._id ? "active" : ""} onSetActive={() => onConversationClick(conv)} key={conv._id} conversation={conv} />
                })}

            </div>
            {renderDialog()}
        </div>
    );
}


const mapStateToProps = (state) => {
    return {
        conversations: state.messages.conversations,
        messages: state.messages.messages,
        user: state.auth.user,
        convUser: state.messages.conversationUser,
        activeConv: state.messages.activeConversation,
        socket: state.auth.socket,
        onlineUsers: state.auth.onlineUsers
    }
}

export default connect(mapStateToProps, { getConversations, getMessages, getConversationUser, setActiveConversation, sendMessage, sendArrivalMessage })(Massenger);