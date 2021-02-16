import { mainColor, subColor } from 'etc/consts';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootReducer } from 'store';
import SignIn from './SignIn';

function Header() {
    let [signInVisible, setSignInVisible] = React.useState<boolean>(false);
    let user = useSelector((state: RootReducer) => state.user);
    
    const pathname = window.location.pathname;
    console.log(pathname);
    
    return (
        <>
            <header>
                <div className='navbar'>
                    <div className='title'>
                        <Link to='/'>
                            <img src={process.env.PUBLIC_URL + '/logo.png'} />
                        </Link>
                    </div>
                    <ul className='menu'>
                        <Link to='/guide'>
                            <li className={pathname.startsWith('/guide') ? 'active' : ''}>
                                크립토 프로젝트
                            </li>
                        </Link>
                        <Link to='/quiz'>
                            <li className={pathname.startsWith('/quiz') ? 'active' : ''}>
                                퀴즈
                            </li>
                        </Link>
                        <Link to='/challenge'> 
                            <li className={pathname.startsWith('/chall') ? 'active' : ''}>
                                챌린지
                            </li>
                        </Link>
                    </ul>
                    <ul className='account'>
                        { user.loggedIn ? (
                            <Link to='/logout'>
                                <li className='material-icons'>
                                    logout
                                </li>
                            </Link>
                        ) : (
                            <li className='material-icons link' onClick={() => setSignInVisible(true) }>
                               login
                            </li>
                        )}
                        <Link to='/signup'>
                            <li className='material-icons'>
                                person_add
                            </li>
                        </Link>
                    </ul>
                </div>
            </header>
            <SignIn visible={signInVisible} setVisible={setSignInVisible} />
        </>
    )
}

export default Header;