import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header>
            <Link to='/'>
                <div className='title'>
                    Team WoodenCompass
                </div>
            </Link>
            <ul className='menu'>
                <Link to='/challenge'> 
                    <li>
                        Challenge
                    </li>
                </Link>
            </ul>
        </header>
    )
}

export default Header;