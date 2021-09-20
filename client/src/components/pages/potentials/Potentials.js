import React  from 'react';
import { connect } from 'react-redux';
import PotentialsBlock from './potentialsBlock/PotentialsBlock';
import './Potentials.scss';

const Pontentials = ({potentials}) => {
    const renderOgo = () => {
        if(potentials.length >= 3) {
            return (<div className="ogo_block"> 
            Ти маєш багато вподобань
            </div>)
        }
        return <></>
    }

    const mapPotentials = (control) => {
        return potentials.map((el, i) => {
            if(i===control) {
                control+=4;
                return <PotentialsBlock key={el._id} user={el}/>

            }
        })
    }
    
    return (
    <div className="potentials_container">
        <div className="potentials_column">
            <div className="potentials_text_block">
                <div className="potentials_label">
                    Вподобання
                </div>
            </div>
            {mapPotentials(0)}
        </div>
        <div className="potentials_column">

            {mapPotentials(1)}
        </div>
        <div className="potentials_column">
            <div className="potentials_text_block">
                {renderOgo()}
            </div>
            {mapPotentials(2)}
        </div>
        <div className="potentials_column">
            {mapPotentials(3)}

        </div>
    </div>)
}

const mapStateToProps = (state) => {
    return {
        potentials: state.like.potentials
    }
}
 
export default connect(mapStateToProps)(Pontentials);