import React from 'react';
import { ReactComponent as Cross } from '../../../svg/Cross.svg';
import { ReactComponent as Heart } from '../../../svg/Heart_MK2.svg';
import { connect } from 'react-redux';
import { setActiveConversationByUserId } from '../../../../actions/messageActions';
import './PotentialsBlock.scss';


const PotentialsBlock = ({user, setActiveConversationByUserId}) => {

    return <div className="potentials_block" >
            <img className="potentials_photo" alt="no data" src={user.photos[0]}/>
        <div className="potentials_bottom_hover">
            <div className="potentials_bottom_justifier">
                <Cross id="cross" className="potentials_svg"/>
                <div className="potentials_bottom_line"></div>
                <Heart className="potentials_svg"/>
            </div>
        </div>
    </div>
}

const mapStateToProps = (state, ownProps) => {
    return {
        user: ownProps.user
    }
}

export default connect(mapStateToProps, {setActiveConversationByUserId})(PotentialsBlock);