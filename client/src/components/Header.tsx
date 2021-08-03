import useSmoothValue from 'etc/useSmoothValue';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootReducer } from 'store';
import { localeList, localeName, setLocale } from 'store/locale';
import SignIn from './SignIn';

function LocaleButton() {
    let [opacity, setDeltaOpacity] = useSmoothValue(0);
    let nowLocale = useSelector((state: RootReducer) => state.locale.locale);
    let dispatch = useDispatch();

    return (
        <>
            <span 
                className='link icon material-icons'
                onMouseEnter={() => setDeltaOpacity(0.1) } 
                onMouseLeave={() => setDeltaOpacity(-0.1) }
            >
                translate
            </span>
            { opacity > 0 && (
                <div 
                    className='localeSelect' 
                    onMouseEnter={() => setDeltaOpacity(0.1) } 
                    onMouseLeave={() => setDeltaOpacity(-0.1) }
                    style={{ opacity }}
                >
                    { localeList.map((locale) => (
                        <div 
                            className={'localeSelectItem' + (locale === nowLocale ? ' focus' : '')} 
                            onClick={() => dispatch(setLocale(locale))}
                            style={{display: 'flex' }}
                        > 
                            <span className='material-icons' style={{flex: '0 0 10%' }}>
                                { locale === nowLocale && 'check' }
                            </span>
                            <span style={{flex: '1 0 0' }}>
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
                <nav className={'navbar' + (expanded ? ' expanded' : '')}>
                    <div className='title'>
                        <Link to='/'>
                            <img 
                                src={process.env.PUBLIC_URL + '/logo.png'} 
                                alt={intl.formatMessage({id: 'team'})}
                            />
                        </Link>
                    </div>
                    { user.loggedIn && (
                        <span className='navitem menu inactive'>
                            <div>
                                <FormattedMessage 
                                    id='header.hello'
                                    values={{name: user.nickname}}
                                />
                            </div>
                        </span>
                    )}
                    <span className={'navitem menu' + (pathname.startsWith('/about') ? ' active' : '')}>
                        <Link to='/about'>
                            <div> { intl.formatMessage({id: 'header.about'})} </div>
                        </Link>
                    </span>
                    <span className='navitem menu'> 
                        <a href='https://chal.team-na.com'> 
                            <div> { intl.formatMessage({id: 'header.chal'})} </div>
                        </a>
                    </span>
                    <span className={'navitem menu' + (pathname.startsWith('/guide') ? ' active' : '')}>
                        <Link to='/guide'> 
                            <div> { intl.formatMessage({id: 'header.guide'}) } </div>
                        </Link>
                    </span>
                    <span className='navitem icons'>
                        { user.loggedIn ? (
                            <span> <Link className='icon material-icons' to='/logout'> logout </Link> </span>
                        ) : (
                            <>
                                <span className='icon material-icons link' onClick={() => setSignInVisible(true)}> login </span>
                                <span> <Link className='icon material-icons' to='/signup'> person_add </Link></span>
                            </>
                        ) }
                        <LocaleButton />
                    </span>
                    <span className={'icon material-icons expandMenu link' + (expanded ? ' active' : '')} onClick={(e) => {
                        e.preventDefault();
                        setExpanded(!expanded);
                    }}>
                        menu
                    </span>
                </nav>
            </header>
            <SignIn visible={signInVisible} setVisible={setSignInVisible} />
        </>
    )
}

export default Header;