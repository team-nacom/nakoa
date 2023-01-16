import React from 'react';

import Header from './Header';
import Footer from './Footer';

interface ApplyParams{
    Content: React.ComponentType<any>,
    Sidebar?: React.ComponentType<any>
};

export function ApplyLayout(params: ApplyParams): React.ComponentType<any>{
    const Content = params.Content;
    const Sidebar = params.Sidebar ?? React.Fragment;

    return () => (
        <>
            <Header />
            <Sidebar />
            <div id='content'>
                <Content />
            </div>
            <Footer />
        </>
    )
}
