import React, { useEffect, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

import usePromise from '#/misc/usePromise';
import { getLocalArticleList } from '#/api/article-local-idb';

import Button from '#/components/Button';
import { Icon } from '@mui/material';

export function ArticleListSidebar(){
    let [loading, articles] = usePromise(() => getLocalArticleList(), []);

    if(loading) return <></>; // default loading screen
    return (
        <nav className='sideBar'>
            <div className='sideBarSwitcher'>
                <Link to='/article/list'>
                    <h2>글 목록</h2>
                </Link>
                
                <Button className='sideBarFolder'>
                    <Icon>menu</Icon>
                </Button>
            </div>
            <ul className='sideArticleList'>
            {(articles ?? []).map((article, no)=>(
                <li key={no} className='sideArticleListItem'>
                    <Link to={ `/article/view/${ article.localIndex! }` }>
                        <div className='articleListTitle'>{ article.metadata.title }</div>
                    </Link>
                    <Link to={ `/article/update/${ article.localIndex! }` }>
                        <Button className='articleListButton'>
                            <Icon>edit</Icon>
                        </Button>
                    </Link>
                </li>
            ))}
            </ul>
            <div className='sideNewArticle'>
                <h2>새 글</h2>
                <Link to='/article/write-classic' className='sideNewArticleButton'>
                    <Icon>text_fields</Icon>
                </Link>
                <Link to='/article/write-cell' className='sideNewArticleButton'>
                    <Icon>dynamic_feed</Icon>
                </Link>
            </div>
            {/* <Link to={ `/article/list` }>
                <Button>모든 글 보기</Button>
            </Link>
            <Link to='/article/write-classic'>
                <Button>새 글(텍스트)</Button>
            </Link>
            <Link to='/article/write-cell'>
                <Button>새 글(셀)</Button>
            </Link> */}
        </nav>
    );
}