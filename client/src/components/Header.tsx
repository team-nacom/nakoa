import { mainColor, subColor } from 'etc/consts';
import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header>
            <div className='navbar'>
                <Link to='/'>
                    <div className='title'>
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
                로그인
            </div>
        </header>
    )
}

export default Header;