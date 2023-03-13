import React, { useEffect, PropsWithChildren } from 'react';

import Header from './Header';
import Footer from './Footer';

import { ArticleListSidebar } from './Sidebar';

type SidebarOption = 'ArticleList';

interface LayoutProps{
    title?: string;
    // message
    sidebar?: JSX.Element | SidebarOption;
};

export function Layout(props: PropsWithChildren<LayoutProps>): JSX.Element{
    // useEffect(() => {
    //     console.log('layout mounted!');
    //     // todo: prevent rerendering as much as possible
    // }, []);

    const title = props.title ?? '';
    const sidebar = props.sidebar ?? null;

    return (<>
        <Header />
        <div id='content'>
            <div className='contentInner'>
                {typeof sidebar !== 'string' &&
                    sidebar
                }
                {sidebar === 'ArticleList' &&
                    <ArticleListSidebar />
                }
                <div className='contentMainWrapper'>
                    {title &&
                        <h1 className='pageTitle'>{ title }</h1>
                    }
                    { props.children }
                </div>
                
            </div>
        </div>
        <Footer />
    </>);
}