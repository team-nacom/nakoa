import React, { PropsWithChildren } from 'react';

import Header from './Header';
import Footer from './Footer';

interface LayoutProps{
    title?: string;
    // message
    sidebar?: JSX.Element;
};

export function ApplyLayout(props: PropsWithChildren<LayoutProps>): JSX.Element{
    const title = props.title ?? '';
    const sidebar = props.sidebar ?? null;

    return (<>
        <Header />
        { sidebar }
        <div id='content'>
            <h1 className='pageTitle'>{ title }</h1>
            { props.children }
        </div>
        <Footer />
    </>);
}
