// 23/01/16 revert & refactored from:
// https://github.com/team-nacom/nakoa/blob/2f279ea8335995a722ccf01896deb5364c405ba2/client/src/pages/guide/Guide.tsx
// WIP

import React, { useState, useMemo } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';

import Loading from './Loading';
import Button from '#/components/Button';
import { ApplyLayout } from '#/layout/Apply';
import usePromise from '#/misc/usePromise';
import { getArticle } from '#/api/article';
import Markdown from '#/components/markdown-lab/Markdown';
import { Display } from '#/components/cell-editor/cell/Display';

function Article() {
    let params = useParams<{ index: string }>();
    let index = useMemo(() => +params.index, [params]);

    let [loading, article] = usePromise(() => getArticle(index), [index]);
    let [redir, setRedir] = useState(false);

    if(redir) return <Redirect to='/' />;
    if(loading) return <Loading />;
    if(article === undefined) return <p> 존재하지 않는 글입니다. </p>;

    if(article.mode === 'classic') return (
        <>
            <h1 className='title'>{ article.metadata.title }</h1>
            <div className='content'>
                <Markdown>
                    { article.text }
                </Markdown>
            </div>
        </>
    );

    /* (article.mode === 'cell') */
    return (
        <>
            <h1 className='title'>{ article.metadata.title }</h1>
            <Display
                {...article.content}
            />
        </>
    );
}

export default ApplyLayout({
    Content: Article
});