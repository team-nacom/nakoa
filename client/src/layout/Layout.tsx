import React, { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';

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

export function LayoutWithArticleList(props: PropsWithChildren<LayoutProps>): JSX.Element{

    let [loading, articles] = usePromise(() => getArticleList(), []);

    const title = props.title ?? '';
    const sidebar = props.sidebar ?? null;

    if(loading) return <></>; // default loading screen
    return (<>
        <Header />
        { sidebar }
        <div id='articleList'>
            {(articles ?? []).map((article, no)=>(
                <Link key={ no } to={ `/article/view/${ article.index! }` }>
                    <div className='articleListEntry'>
                        { article.metadata.title }
                        &nbsp;by&nbsp; 
                        { article.metadata.author }
                    </div>
                </Link>
            ))}
            <Link to={ `/article/list` }>
                <Button>모든 글 보기</Button>
            </Link>
            <Link to='/article/write-classic'>
                <Button>새 글(텍스트)</Button>
            </Link>
            <Link to='/article/write-cell'>
                <Button>새 글(셀)</Button>
            </Link>
        </div>
        <div id='content'>
            <h1 className='pageTitle'>{ title }</h1>
            { props.children }
        </div>
        <Footer />
    </>);
}