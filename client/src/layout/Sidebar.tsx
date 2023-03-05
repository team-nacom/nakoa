import React, { useEffect, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

import usePromise from '#/misc/usePromise';
import { getArticleList } from '#/api/article';

import Button from '#/components/Button';

export function ArticleListSidebar(){
    let [loading, articles] = usePromise(() => getArticleList(), []);

    if(loading) return <></>; // default loading screen
    return (<div id='sidebar'>
        <ul className='articleList'>
        {(articles ?? []).map((article, no)=>(
            <li key={no}>
                <Link to={ `/article/view/${ article.localIndex! }` }>
                { article.metadata.title }
                </Link>
                <Link to={ `/article/update/${ article.localIndex! }` }>
                    (편집)
                </Link>
            </li>
        ))}
        </ul>
        <Link to={ `/article/list` }>
            <Button>모든 글 보기</Button>
        </Link>
        <Link to='/article/write-classic'>
            <Button>새 글(텍스트)</Button>
        </Link>
        <Link to='/article/write-cell'>
            <Button>새 글(셀)</Button>
        </Link>
    </div>);
}