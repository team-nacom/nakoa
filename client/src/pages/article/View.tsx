// 23/01/16 revert & refactored from:
// https://github.com/team-nacom/nakoa/blob/2f279ea8335995a722ccf01896deb5364c405ba2/client/src/pages/guide/Guide.tsx
// WIP

import React, { useState, useMemo } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';

import Loading from '../Loading';
import Button from '#/components/Button';
import { ApplyLayout } from '#/layout/Apply';
import usePromise from '#/misc/usePromise';
import { IdxType, toIdx, getArticle } from '#/api/article';
import Markdown from '#/components/markdown-lab/Markdown';
import { Display } from '#/components/cell-editor/cell/Display';

function Article() {
    let params = useParams<{ index: string }>();
    let index: IdxType = useMemo(() => toIdx(params.index), [params]);

    let [loading, article] = usePromise(() => getArticle(index), [index]);
    let [redir, setRedir] = useState(false);

    if(redir) return <Redirect to='/' />;
    if(loading) return <Loading />;
    if(article === undefined){
        return <ApplyLayout>
            <p>존재하지 않는 글입니다.</p>
        </ApplyLayout>;
    }

    return <ApplyLayout /* title={ article.metadata.title } */ >
        <div className='article'>
            <div className='articleBackground' />
            <h2 className='subtitle'> { article.metadata.author } </h2>
            <h1 className='title'> { article.metadata.title } </h1>
            <div className='articleContent'>
            {article.mode === 'classic' &&
                <Markdown>
                    { article.text }
                </Markdown>
            }
            {article.mode === 'cell' &&
                <Display
                    {...article.content}
                />
            }
            </div>
        </div>
        <Link to={ `/article/update/${ index }` }>
            <Button>편집</Button>
        </Link>
        <Link to={ `/article/delete/${ index }` }>
            <Button>삭제</Button>
        </Link>
    </ApplyLayout>;
}

export default Article;