import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import match from '../../imgs/Sympathy main.png'
import textBlank from '../../imgs/Sympathy text stuff.png';
import _ from 'lodash'
import './Match.scss';
import { setActiveConversationByUserId } from '../../../actions/messageActions';

class Match extends React.Component{


    constructor(props) {
        super(props)
        this.state = {
            class: ''
        }
    }



    render() {
        const { user, matchedUser } = this.props;
        if(_.isEmpty(user) || _.isEmpty(matchedUser)) {
            return <></>
        }
        return (
            <div onClick={this.props.onClk} className={`match_container ${this.props.isVisible ? '' : 'hide'}`}> 
                <div className="match_top">
                    <img className="match_background_photo" src={match}/>
                    <div className="match_photos_block">
                        <img className="match_photo left" src={user?.photos[0]} alt="err"/>
                        <img className="match_photo right" src={matchedUser?.photos[0]} alt="err"/>
                    </div>
                </div>
                <div className="match_text_blank_container">
                    <img className="match_text_blank" src={textBlank}/>
                    <span className="match_text">Схоже - це взаємна симпатія! <span className="match_name">{matchedUser?.name}</span> уже чекає на твоє повідомлення.
                    <br/>
                        <Link to="/home/conversations" className="match_link" 
                        onClick={() => this.props.setActiveConversationByUserId(matchedUser._id)}
                        >Напиши {matchedUser.gender === 'male' ? 'йому': 'їй'}</Link>
                    </span>
                </div>
            </div>
        );
    }
    
};

export default connect(null, {setActiveConversationByUserId})(Match);