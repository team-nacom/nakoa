import React from 'react';

import Header from './Header';
import Footer from './Footer';

interface ApplyParams{
    title?: string;
    // message
    content: JSX.Element;
    sidebar?: JSX.Element;
};

export function ApplyLayout(params: ApplyParams): JSX.Element{
    const title = params.title ?? '';
    const content = params.content;
    const sidebar = params.sidebar ?? React.Fragment;

    return (<>
        <Header />
        { sidebar }
        <h1>{ title }</h1>
        <div id='content'>
            { content }
        </div>
        <Footer />
    </>);
}
