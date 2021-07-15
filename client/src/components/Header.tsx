import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootReducer } from 'store';
import { localeList, localeName, setLocale } from 'store/locale';
import SignIn from './SignIn';

function LocaleButton() {
    let [selectActive, setSelectActive] = React.useState(false);
    let nowLocale = useSelector((state: RootReducer) => state.locale.locale);
    let dispatch = useDispatch();

    return (
        <>
            <span className='link material-icons' onClick={() => setSelectActive(!selectActive)}>
                translate
            </span>
            { selectActive && (
                <div className='localeSelect'>
                    { localeList.map((locale) => (
                        <div 
                            className={'localeSelectItem' + (locale === nowLocale ? ' focus' : '')} 
                            onClick={() => dispatch(setLocale(locale))}
                            style={{display: 'flex'}}
                        > 
                            <span className='material-icons' style={{flex: '0 0 10%'}}>
                                { locale === nowLocale && 'check' }
                            </span>
                            <span style={{flex: '1 0 0'}}>
                                { localeName[locale] } 
                            </span>
                        </div> 
                    ))} 
                </div>
            )}
        </>
    )
}

function Header() {
    let [signInVisible, setSignInVisible] = React.useState<boolean>(false);
    let user = useSelector((state: RootReducer) => state.user);
    let [expanded, setExpanded] = React.useState<boolean>(false);
    let intl = useIntl();

    const pathname = window.location.pathname;
    
    return (
        <>
            <header>
                <nav className='navbar'>
                    <div className='title'>
                        <Link to='/'>
                            <img src={process.env.PUBLIC_URL + '/logo.png'} alt={intl.formatMessage({id: 'team'})}/>
                        </Link>
                    </div>
                    <ul className={'menu' + (expanded ? ' expanded' : '')}>
                        { user.loggedIn && (
                            <li className='inactive'>
                                <FormattedMessage 
                                    id='header.hello'
                                    values={{name: user.nickname}}
                                />
                            </li>
                        )}
                        <li className={pathname.startsWith('/about') ? 'active' : ''}>
                            <Link to='/about'>{ intl.formatMessage({id: 'header.about'})} </Link>
                        </li>
                        <li> <a href='https://chal.team-na.com'> { intl.formatMessage({id: 'header.chal'})} </a> </li>
                        <li className={pathname.startsWith('/guide') ? 'active' : ''}>
                            <Link to='/guide'> { intl.formatMessage({id: 'header.guide'}) } </Link>
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
                        <li>
                            <LocaleButton/>
                        </li>
                    </ul>
                </nav>
            </header>
            <SignIn visible={signInVisible} setVisible={setSignInVisible} />
        </>
    )
}

export default Header;