// 23/01/16 revert & refactored from:
// https://github.com/team-nacom/nakoa/blob/2f279ea8335995a722ccf01896deb5364c405ba2/client/src/pages/guide/Guide.tsx
// WIP

import React, { useState, useMemo } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';

import Loading from '../Loading';
import Button from '#/components/Button';
import { Layout } from '#/layout/Layout';

import usePromise from '#/misc/usePromise';
import { getLocalArticle } from '#/api/article';
import Markdown from '#/components/markdown/Markdown';
import { Display } from '#/components/cell-editor/cell/Display';
import { Icon } from '@mui/material';
import { postPublicArticle } from '#/api/article-public';

function Article() {
    let params = useParams<{ index: string }>();
    let index = params.index;

    let [loading, article] = usePromise(() => getLocalArticle(index), [index]);
    let [redir, setRedir] = useState(false);

    if(redir) return <Redirect to='/' />;
    if(loading) return <Loading />;
    if(article === undefined){
        return <Layout title='오류' sidebar='ArticleList'>
            <p>존재하지 않는 글입니다.</p>
        </Layout>;
    }

    return <Layout /* title={ article.metadata.title } */ sidebar='ArticleList'>
        <div className='article'>
            <div className='articleButtonContainer'>
                <Link to={ `/article/update/${ index }` }>
                    <Button className='articleButton'>
                        <Icon>edit</Icon>
                    </Button>
                </Link>
                <Link to={ `/article/delete/${ index }` }>
                    <Button className='articleButton'>
                        <Icon>delete</Icon>
                    </Button>
                </Link>
                <Button
                    onClick={ () => {
                        postPublicArticle(article!);
                    } }
                >
                    publish
                </Button>
            </div>
            <div className='articleContentMain'>
                <h1 className='title'> { article.metadata.title } </h1>
                {/* <h2 className='subtitle'> { article.metadata.author } </h2> */}
                {article.mode === 'classic' && (
                    <Markdown>
                        { article.text }
                    </Markdown>
                ) }
                {article.mode === 'cell' && (
                    <Display
                        {...article.content}
                    />
                ) }
            </div>

            {/* <div className='articleBackground' /> */}

        </div>
    </Layout>;
}

export default Article;