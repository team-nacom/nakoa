import { mainColor, subColor } from 'etc/consts';
import React from 'react';
import { Link } from 'react-router-dom';
import SignIn from './Signin';

function Header() {
    let [signInVisible, setSignInVisible] = React.useState<boolean>(false);
    
    return (
        <>
            <header>
                <div className='navbar'>
                    <Link to='/'>
                        <div className='title' style={{fontSize: '18px', fontWeight: 'normal'}}>
                            <span style={{color: mainColor}}>나무</span><span style={{color: subColor}}>컴퍼스</span>
                        </div>
                    </Link>
                    <ul className='menu'>
                        <Link to='/challenge'> 
                            <li>
                                Challenge
                            </li>
                        </Link>
                    </ul>
                </div>
                <div className='menubar'>
                    <span className='link' onClick={() => setSignInVisible(true) }>
                        로그인
                    </span>
                </div>
            </header>
            <SignIn visible={signInVisible} setVisible={setSignInVisible} />
        </>
    )
}

export default Header;