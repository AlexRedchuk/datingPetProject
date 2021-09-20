import React  from 'react';
import { connect } from 'react-redux';
import './Symphaties.scss';
import SymphatyBlock from './symphatyBlock/SymphatyBlock';

const Symphaties = ({symphaties}) => {

    const renderOgo = () => {
        if(symphaties.length >= 3) {
            return (<div className="ogo_block"> 
            Ти багато кому подобаєшся
            </div>)
        }
        return <></>
    }

    const mapSymphaties = (control) => {
        return symphaties.map((el, i) => {
            if(i===control) {
                control+=4;
                return <SymphatyBlock key={el._id} user={el}/>

            }
        })
    }
    
    return (
    <div className="symphaties_container">
        <div className="symphaties_column">
            <div className="symphaty_text_block">
                <div className="symphaties_label">
                    Симпатії
                </div>
            </div>
            {mapSymphaties(0)}
        </div>
        <div className="symphaties_column">

            {mapSymphaties(1)}
        </div>
        <div className="symphaties_column">
            <div className="symphaty_text_block">
                {renderOgo()}
            </div>
            {mapSymphaties(2)}
        </div>
        <div className="symphaties_column">
            {mapSymphaties(3)}

        </div>
    </div>)
}

const mapStateToProps = (state) => {
    return {
        symphaties: state.like.symphaties
    }
}
 
export default connect(mapStateToProps)(Symphaties);