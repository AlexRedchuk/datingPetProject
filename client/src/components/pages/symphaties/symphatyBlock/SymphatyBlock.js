import React from 'react';
import { ReactComponent as Verified } from '../../../svg/Verified.svg'
import { _calculateAge } from '../../../helpers/calculateAge';
import { ReactComponent as Message } from '../../../svg/Message icon MK_2.svg';
import './SymphatyBlock.scss';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setActiveConversationByUserId } from '../../../../actions/messageActions';


const SymphatyBlock = ({user, setActiveConversationByUserId}) => {

    return <div className="symphaty_block" >
            <img className="symphaty_photo" alt="no data" src={user.photos[0]}/>
        <div className="symphaty_block_bottom">
            <div className="symphaty_name">
                <span>{user.name}, {_calculateAge(new Date(user.dateOfBirth))}</span>
                <Verified className="symphaty_verified"/>
            </div>
        </div>
        <Link onClick={() => setActiveConversationByUserId(user._id)} to="/home/conversations" className="symphaty_bottom_hover">
            <Message className="symphaty_message"/>
            <span>Написати</span>
        </Link>
    </div>
}

const mapStateToProps = (state, ownProps) => {
    return {
        user: ownProps.user
    }
}

export default connect(mapStateToProps, {setActiveConversationByUserId})(SymphatyBlock);