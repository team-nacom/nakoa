import React, { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

import usePromise from '#/misc/usePromise';
import { getArticleList } from '#/api/article';

import Button from '#/components/Button';

export function ArticleListSidebar(){
    let [loading, articles] = usePromise(() => getArticleList(), []);

    if(loading) return <></>; // default loading screen
    return (<div id='articleList'>
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
    </div>);
}