import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootReducer } from 'store';
import SignIn from './SignIn';

function Header() {
    let [signInVisible, setSignInVisible] = React.useState<boolean>(false);
    let user = useSelector((state: RootReducer) => state.user);
    let [expanded, setExpanded] = React.useState<boolean>(false);
    
    const pathname = window.location.pathname;
    
    return (
        <>
            <header>
                <nav className='navbar'>
                    <div className='title'>
                        <Link to='/'>
                            <img src={process.env.PUBLIC_URL + '/logo.png'} alt='팀 나무컴퍼스'/>
                        </Link>
                    </div>
                    <ul className={'menu' + (expanded ? ' expanded' : '')}>
                        { user.loggedIn && (
                            <li className='inactive'>
                                { user.nickname + '님, 안녕하세요!' }
                            </li>
                        )}
                        <li className={pathname.startsWith('/about') ? 'active' : ''}>
                            <Link to='/about'>About</Link>
                        </li>
                        <li> <a href='https://chal.team-na.com'> 챌린지 </a> </li>
                        <li className={pathname.startsWith('/guide') ? 'active' : ''}>
                            <Link to='/guide'>가이드</Link>
                        </li>
                        {/*
                        <li className={pathname.startsWith('/quiz') ? 'active' : ''}>
                            <Link to='/quiz'>퀴즈</Link>
                        </li>
                        <li className={pathname.startsWith('/challenge') ? 'active' : ''}>
                            <Link to='/challenge'>챌린지</Link>
                        </li>
                         */}
                    </ul>
                    <ul className='account'>
                        { user.loggedIn ? (
                            <li>
                                <Link className="material-icons" to='/logout'>logout</Link>
                            </li>
                        ) : (<>
                            <li>
                                <i className='material-icons link' onClick={() => setSignInVisible(true) }>login</i>
                            </li>

                            <li>
                                <Link className="material-icons" to='/signup'>person_add</Link>
                            </li>
                        </>)}
                        <li className={'mobileOnly material-icons link' + (expanded ? ' active' : '')} onClick={(e) => {
                            e.preventDefault();
                            setExpanded(!expanded);
                        }}>
                            menu
                        </li>
                    </ul>
                </nav>
            </header>
            <SignIn visible={signInVisible} setVisible={setSignInVisible} />
        </>
    )
}

export default Header;