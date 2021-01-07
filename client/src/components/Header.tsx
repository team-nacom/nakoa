import { mainColor, subColor } from 'etc/consts';
import React from 'react';
import { Link } from 'react-router-dom';
import SignIn from './SignIn';

function Header() {
    let [signInVisible, setSignInVisible] = React.useState<boolean>(false);
    
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
                        <Link to='/quiz'>
                            <li>
                                퀴즈
                            </li>
                        </Link>
                        <Link to='/challenge'> 
                            <li>
                                챌린지
                            </li>
                        </Link>
                    </ul>
                </div>
                <div className='menubar'>
                    <span className='link' onClick={() => setSignInVisible(true) }>
                        로그인
                    </span>
                    <Link to='/signup'>
                        <span> 회원 가입 </span>
                    </Link>
                </div>
            </header>
            <SignIn visible={signInVisible} setVisible={setSignInVisible} />
        </>
    )
}

export default Header;