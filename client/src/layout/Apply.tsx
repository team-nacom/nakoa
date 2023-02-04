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
    const sidebar = props.sidebar ?? React.Fragment;

    return (<>
        <Header />
        { sidebar }
        <h1>{ title }</h1>
        <div id='content'>
            { props.children }
        </div>
        <Footer />
    </>);
}
