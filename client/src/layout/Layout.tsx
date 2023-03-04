import React, { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';

import { ArticleListSidebar } from './Sidebar';

import usePromise from '#/misc/usePromise';
import { getArticleList } from '#/api/article';

import Button from '#/components/Button';


interface LayoutProps{
    title?: string;
    // message
    sidebar?: JSX.Element;
};

export function Layout(props: PropsWithChildren<LayoutProps>): JSX.Element{
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