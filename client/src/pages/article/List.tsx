import React, { useState, useMemo } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';

import Loading from '../Loading';
import Button from '#/components/Button';
import { Layout } from '#/layout/Layout';
import { ArticleListSidebar } from '#/layout/Sidebar';
import usePromise from '#/misc/usePromise';
import { getArticleList } from '#/api/article';
// import Markdown from '#/components/markdown-lab/Markdown';
// import { Display } from '#/components/cell-editor/cell/Display';


function Article() {
    let [loading, articles] = usePromise(() => getArticleList(), []);
    let [redir, setRedir] = useState(false);

    if(redir) return <Redirect to='/' />;
    if(loading) return <Loading />;
    if(articles === undefined){
        return <Layout title='오류' sidebar='ArticleList'>
            글을 불러오지 못했습니다.
        </Layout>;
    }

    return <Layout title='모든 글 보기' sidebar='ArticleList'>
        <div>
            { `총 ${articles.length}개` }
        </div>
        <div className='articleFeedList'>
            {articles.map((article, no) => (
                <div key={ no } className='articleFeed'>
                    <Link to={ `/article/view/${ article.localIndex! }` }>
                        <div className='articleFeedContent'>
                            <div className='author'>{ article.metadata.author }</div>
                            <div className='title'>{ article.metadata.title }</div>
                            <div className='content'>
                                { article.mode === 'classic' ?
                                    article.text.substring(0,100)
                                    : '[Cell Mode]'
                                }
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
        <Link to='/article/write-classic'>
            <Button>새 글(텍스트)</Button>
        </Link>
        <Link to='/article/write-cell'>
            <Button>새 글(셀)</Button>
        </Link>
    </Layout>;
}

export default Article;