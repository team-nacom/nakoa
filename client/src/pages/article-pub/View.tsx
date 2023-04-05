import React, { useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import Loading from '../Loading';
import Button from '#/components/Button';
import { Layout } from '#/layout/Layout';

import usePromise from '#/misc/usePromise';
import { getLocalArticle, getLocalArticleWithPublicIndex, postLocalArticle } from '#/api/article-local-idb';
import { getPublicArticle, postPublicArticle, removePublicArticle, updatePublicArticle } from '#/api/article-public';

import Markdown from '#/components/markdown/Markdown';
import { Display } from '#/components/cell-editor/cell/Display';
import { Icon } from '@mui/material';

import { Article } from '#/components/cell-editor/types';

// import { getPublicArticleList } from '#/api/article-public';

function View() {
    let { publicIndex } = useParams<{ publicIndex: string }>();

    const navigate = useNavigate();

    const [forkedArticle, setForkedArticle] = useState<Article>();

    const [loading, article] = usePromise(async () => {
        setForkedArticle(undefined);

        const article = await getPublicArticle(publicIndex!);
        if(article?.localIndex === undefined){
            // unauthorized

            getLocalArticleWithPublicIndex(publicIndex!)
                .then(localArticle => {
                    if(localArticle !== undefined){
                        setForkedArticle(localArticle);
                    }
                })
        }
        return article;
    }, [publicIndex]);

    if(loading) return <Loading />;
    if(article === undefined){
        return <Layout title='오류' sidebar='ArticleList'>
            <p>존재하지 않는 글입니다.</p>
        </Layout>;
    }

    return <Layout /* title={ article.metadata.title } */ sidebar='ArticleList'>
        <div className='article'>
            <div className='articleButtonContainer'>
                {/* <Link to={ `/article/update/${ publicIndex }` }>
                    <Button className='articleButton'>
                        <Icon>edit</Icon>
                    </Button>
                </Link>
                <Link to={ `/article/delete/${ publicIndex }` }>
                    <Button className='articleButton'>
                        <Icon>delete</Icon>
                    </Button>
                </Link> */}
                { article.localIndex && ( // authorized.
                    <>
                        <Button className='articleButton'
                            onClick={ async () => {
                                // by 'deleting' an article the owner can withdraw its publication.

                                await removePublicArticle(publicIndex!);

                                // to local article page
                                navigate(`/article/list`);
                            } }
                        >
                            <Icon>delete</Icon>
                        </Button>
                        <Button className='articleButton'
                            onClick={ async () => {
                                // todo : prevent double query into local article
                                // todo : check if publicArticle is up-to-date

                                const localArticle = await getLocalArticle(article.localIndex!);
                                
                                await updatePublicArticle(article.publicIndex!, localArticle!);

                                // refresh!
                                navigate(0);
                            } }
                        >
                            <Icon>sync</Icon>
                        </Button>
                        <Link to={ `/article/view/${article.localIndex}` }>
                            <Button className='articleButton'>내 글 보기</Button>
                        </Link>
                    </>
                )}
                { forkedArticle !== undefined && ( // has fork.
                    <>
                        <Button className='articleButton'
                            onClick={ async () => {
                                await postPublicArticle(article!);

                                navigate(`/article/view/${forkedArticle.localIndex}`);
                            } }
                        >
                            포크 글 업로드
                        </Button>
                        <Link to={ `/article/view/${forkedArticle.localIndex}` }>
                            <Button className='articleButton'>포크 글 보기</Button>
                        </Link>
                    </>
                )}
                { !article.localIndex && !forkedArticle && ( // unauthorized and doesn't have fork.
                    <Button
                        onClick={ async () => {
                            // let { localIndex } = await getPublicArticle(publicIndex);
                            let { localIndex } = await postLocalArticle(article); // fork
                            // navigate with localIndex

                            navigate(`/article/view/${localIndex}`);
                        } }
                    >
                        fork
                    </Button>
                )}
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

export default View;