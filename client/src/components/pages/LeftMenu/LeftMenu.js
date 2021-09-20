import React, {useState, useEffect}from 'react';
import logo from '../../imgs/Afrodite logo.png'
import line from '../../imgs/Line 2.png'
import { connect } from 'react-redux';
import { Link, NavLink, useRouteMatch } from 'react-router-dom';
import { logOut } from '../../../actions/authActions';
import { ReactComponent as Settings } from '../../svg/Settings.svg';
import { ReactComponent as Exit } from '../../svg/Exit.svg';
import { ReactComponent as Planet } from '../../svg/Planet icon.svg';
import { ReactComponent as Message } from '../../svg/Message icon MK_2.svg';
import { ReactComponent as Heart } from '../../svg/Heart.svg';
import { ReactComponent as Star } from '../../svg/star.svg';
import { ReactComponent as Symph } from '../../svg/Mutch.svg';
import { ReactComponent as Visitors } from '../../svg/Visitors.svg';
import './LeftMenu.scss'


const LeftMenu = ({ logOut, symphaties, potentials, user, unreadMessages, onLinkClick}) => {
    let { url } = useRouteMatch();
    return (
            <nav 
            className={`left_menu_nav`}>
                    <Link className="logo" to={`${url}`}><img className="logo" src={logo} alt="no foto" /></Link>
                    <img className="logo_line" src={line} alt="line" />
                    <div className="profile_info">
                        <img className="profile_avatar" src={user.photos[0]} alt="avatar" />
                        <div className="settings_exit">
                            <div className="settings_justifier">
                                <div className="Left_menu_user_name">{user.name}</div>
                                <Exit id="exit" onClick={() => logOut()} className="exit_icon" />
                            </div>
                            <div className="settings_justifier">
                                <Link to="#" className="statistics_label" >Моя статистика</Link>
                                <Link id="settings" to={`${url}/settings`}><Settings id="settings" className="settings_icon" /></Link>
                            </div>
                        </div>
                    </div>
                    <img className="logo_line" src={line} alt="line" />
                    <NavLink onClick={onLinkClick} activeClassName="active" exact to={`${url}`} className="left_menu_item">
                        <div className="svg_justifier">
                            <Planet className="menu_item_svg"/>
                        </div>
                        <span>Знайомства</span>
                    </NavLink>
                    <NavLink onClick={onLinkClick} to={`${url}/conversations`} className="left_menu_item">
                        <div className="svg_justifier">
                            <Message className="menu_item_svg"/>
                        </div>
                        <div className="menu_item_justifier">
                            <span>Повідомлення</span>
                            <div className="left_menu_item_counter">{unreadMessages}</div>
                        </div>
                    </NavLink>
                    <NavLink onClick={onLinkClick} to={`${url}/symphaties`} className="left_menu_item">
                        <div className="svg_justifier">
                            <Symph className="menu_item_svg"/>
                        </div>
                        <div className="menu_item_justifier">
                            <span>Симпатії</span>
                            <div className="left_menu_item_counter">{symphaties.length}</div>
                        </div>
                    </NavLink>
                    <NavLink onClick={onLinkClick} to={`${url}/potentials`} className="left_menu_item">
                        <div className="svg_justifier">
                            <Heart id="heart" className="menu_item_svg"/>
                        </div>
                        <div className="menu_item_justifier">
                            <span>Вподобання</span>
                            <div className="left_menu_item_counter">{potentials.length}</div>
                        </div>
                    </NavLink>
                    <NavLink onClick={onLinkClick} to={`${url}/chosen`} className="left_menu_item">
                        <div className="svg_justifier">
                            <Star  className="menu_item_svg"/>
                        </div>
                        <span>Обрані</span>
                    </NavLink>
                    <NavLink onClick={onLinkClick} to={`${url}/visitors`} className="left_menu_item">
                        <div className="svg_justifier">
                            <Visitors className="menu_item_svg"/>
                        </div>
                        <span>Відвідувачі</span>
                    </NavLink>
                </nav>
    );
}

const mapStateToProps = (state, ownProps) => {
    return {
        symphaties: state.like.symphaties,
        potentials: state.like.potentials,
        user: state.auth.user,
        unreadMessages: state.messages.unReadMessageCount,
        onLinkClick: ownProps.onLinkClick
    }
}

export default connect(mapStateToProps, { logOut })(LeftMenu);