import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink, Redirect, Switch, useRouteMatch } from 'react-router-dom';
import { getUser, logOut, setOnlineUsers, setSocket } from '../../../actions/authActions';
import UserCard from '../userCard/UserCard';
import ProtectedRoute from '../../helpers/ProtectedRoute';
import SettingsPage from '../settings/SettingsPage';
import Symphaties from '../symphaties/Symphaties';
import { getPotentials, getSymphaties } from '../../../actions/likeActions';
import Potentials from '../potentials/Potentials';
import Messenger from '../massenger/Messenger';
import logo from '../../imgs/Afrodite logo (2).png'
import line from '../../imgs/Line.png'
import { io } from 'socket.io-client';
import { ReactComponent as Planet } from '../../svg/Planet icon.svg';
import { ReactComponent as Message } from '../../svg/Message icon MK_2.svg';
import { ReactComponent as Heart } from '../../svg/Heart.svg';
import { ReactComponent as Star } from '../../svg/star.svg';
import { ReactComponent as Symph } from '../../svg/Mutch.svg';
import { ReactComponent as Visitors } from '../../svg/Visitors.svg';
import _ from 'lodash';
import './HomePage.css'
import LeftMenu from '../LeftMenu/LeftMenu';
import { getConversations, getUnreadMessageCount } from '../../../actions/messageActions';
import PageIsDeveloping from '../errorPages/PageIsDeveloping';


const HomePage = ({ logOut, getSymphaties, getPotentials, symphaties, potentials, 
    getUser, user, unreadMessages, getUnreadMessageCount, getConversations, setSocket,
    socket, setOnlineUsers }) => {
    let { url } = useRouteMatch();
    const [leftMenuFlag, setLeftMenuFlag] = useState(false);
    
    useEffect(() => {
        async function getSymph() {
            await getUser()
            await getSymphaties();
            await getPotentials();
            await getUnreadMessageCount();
            await getConversations();
            const ios = await io("ws://localhost:8900")
            setSocket(ios)
        }
        getSymph();
    }, [getSymphaties, getPotentials, getUser, getUnreadMessageCount, getConversations, setSocket])
    useEffect(() => {
        socket?.emit("addUser", user._id)
        socket?.on("getUsers", users => {
            setOnlineUsers(users);
        })
    }, [socket]);
    if (_.isEmpty(user)) {
        return <div>Loading...</div>
    }

    const renderLeftMenu = () => {
        if(leftMenuFlag) {
            return <LeftMenu onLinkClick={() => setLeftMenuFlag(false)} unmount={leftMenuFlag}/>
        }
        else {
            return <></>
        }
    }

    const renderMessageStatus = (flag) => {
        if(flag) {
            return <div className="msg_status"></div>
        }
        else return <></>
    }

    const renderBlur = () => {
        if(leftMenuFlag) {
            return <div className="blured_background"></div>
        }
        else {
            return <></>
        }
    }
    
// {renderLeftMenu()}
    return (
        <>
            {renderLeftMenu()}
        <div className="main_home_container" onMouseEnter={() => setLeftMenuFlag(false)}>
            {renderBlur()}
            <div className="home_container">
                <nav onMouseEnter={() => setLeftMenuFlag(true)} >
                    <Link className="home_logo" to={`${url}`}><img className="logo" src={logo} alt="no foto" /></Link>
                    <img className="home_logo_line" src={line} alt="line" />
                    <div  >
                        <img className="home_profile_avatar" src={user.photos[0]} alt="avatar" />
                        
                    </div>
                    <img className="home_logo_line" src={line} alt="line" />
                    <NavLink activeClassName="active" exact to={`${url}`} className="home_menu_item">
                        <div className="home_svg_justifier">
                            <Planet className="home_menu_item_svg"/>
                        </div>
                    </NavLink>
                    <NavLink to={`${url}/conversations`} className="home_menu_item">
                        <div className="home_svg_justifier">
                            <Message className="home_menu_item_svg"/>
                            {renderMessageStatus(unreadMessages !== 0)}
                        </div>
                    </NavLink>
                    <NavLink to={`${url}/symphaties`} className="home_menu_item">
                        <div className="home_svg_justifier">
                            <Symph className="home_menu_item_svg"/>
                            {renderMessageStatus(symphaties.length !== 0)}
                        </div>
                    </NavLink>
                    <NavLink to={`${url}/potentials`} className="home_menu_item">
                        <div className="home_svg_justifier">
                            <Heart id="heart" className="home_menu_item_svg"/>
                            {renderMessageStatus(potentials.length !== 0)}
                        </div>
                    </NavLink>
                    <NavLink to={`${url}/chosen`} className="home_menu_item">
                        <div className="home_svg_justifier">
                            <Star  className="home_menu_item_svg"/>
                        </div>
                    </NavLink>
                    <NavLink to={`${url}/visitors`} className="home_menu_item">
                        <div className="home_svg_justifier">
                            <Visitors className="home_menu_item_svg"/>
                        </div>
                    </NavLink>
                </nav>
                <Switch>
                    <ProtectedRoute path={`${url}/settings`} exact component={PageIsDeveloping} />
                    <ProtectedRoute path={`${url}`} exact component={UserCard} />
                    <ProtectedRoute path={`${url}/symphaties`} exact component={Symphaties} />
                    <ProtectedRoute path={`${url}/potentials`} exact component={Potentials} />
                    <ProtectedRoute path={`${url}/conversations`} exact component={Messenger} />
                    <ProtectedRoute path={`${url}/chosen`} exact component={PageIsDeveloping}/>
                    <ProtectedRoute path={`${url}/visitors`} exact component={PageIsDeveloping}/>
                    <Redirect to="/pageIsDeveloping" />
                </Switch>
            </div>
        </div>
        </>)
}

const mapStateToProps = (state) => {
    return {
        symphaties: state.like.symphaties,
        potentials: state.like.potentials,
        user: state.auth.user,
        socket: state.auth.socket,
        unreadMessages: state.messages.unReadMessageCount
    }
}

export default connect(mapStateToProps, { logOut, getSymphaties, getPotentials, 
    getUser, getUnreadMessageCount, getConversations, setSocket, setOnlineUsers })(HomePage);