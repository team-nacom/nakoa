import useSmoothValue from '#/misc/useSmoothValue';

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Icon } from '@mui/material';

function LocaleButton() {
    let [opacity, setDeltaOpacity] = useSmoothValue(0);
    let { i18n } = useTranslation('info');

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
                    { i18n.languages.map((lang) => (
                        <div 
                            className={'localeSelectItem' + (lang === i18n.language ? ' focus' : '')} 
                            onClick={() => i18n.changeLanguage(lang) }
                            style={{display: 'flex' }}
                        > 
                            <span className='material-icons' style={{flex: '0 0 10%' }}>
                                { lang === i18n.language && 'check' }
                            </span>
                            <span style={{flex: '1 0 0' }}>
                                { i18n.t('name') } 
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
    let [expanded, setExpanded] = React.useState<boolean>(false);

    let { i18n } = useTranslation('translation');

    const pathname = window.location.pathname;
    
    return (
        <>
            <header>
                <nav className={'navbar' + (expanded ? ' expanded' : '')}>
                    <div className='title'>
                        <Link to='/'>
                            <img 
                                src={process.env.PUBLIC_URL + '/logo.png'} 
                                alt={ i18n.t('team') ?? '' }
                            />
                        </Link>
                    </div>
                    <span className={'navitem menu' + (pathname.startsWith('/list') ? ' active' : '')}>
                        <Link to='/article/list'>
                            <div> { "글 목록" } </div>
                        </Link>
                    </span>
                    <span className={'navitem menu' + (pathname.startsWith('/about') ? ' active' : '')}>
                        <Link to='/about'>
                            <div> { i18n.t('header.about') ?? '' } </div>
                        </Link>
                    </span>
                    <span className='navitem menu'> 
                        <a href='https://chal.team-na.com'> 
                            <div> { i18n.t('header.chal') ?? '' } </div>
                        </a>
                    </span>
                    <Icon className={'expandMenu link' + (expanded ? ' active' : '')} onClick={(e) => {
                        e.preventDefault();
                        setExpanded(!expanded);
                    }}>
                        menu
                    </Icon>
                </nav>
            </header>
        </>
    )
}

export default Header;