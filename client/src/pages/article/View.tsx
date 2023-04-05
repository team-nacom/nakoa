// 23/01/16 revert & refactored from:
// https://github.com/team-nacom/nakoa/blob/2f279ea8335995a722ccf01896deb5364c405ba2/client/src/pages/guide/Guide.tsx
// WIP

import React, { useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import Loading from '../Loading';
import Button from '#/components/Button';
import { Layout } from '#/layout/Layout';

import usePromise from '#/misc/usePromise';
import { getLocalArticle, removeLocalArticle } from '#/api/article-local-idb';
import { getPublicArticle, postPublicArticle, removePublicArticle, updatePublicArticle } from '#/api/article-public';

import Markdown from '#/components/markdown/Markdown';
import { Display } from '#/components/cell-editor/cell/Display';
import { Icon } from '@mui/material';

function View() {
    const { localIndex } = useParams<{ localIndex: string }>();

    const navigate = useNavigate();

    const [publicIndex, setPublicIndex] = useState<string>();

    const [loading, article] = usePromise(async () => {
        // this component shares hook along every localIndex params, so initialize it every time.
        setPublicIndex(undefined);

        const article = await getLocalArticle(localIndex!);

        if(article?.publicIndex){
            // if publicIndex is set -- owner and published.
            // if article has publicIndex but publicIndex is not set -- forked.
            // otherwise -- unpublished.

            // do this async (make all handlers on published branch use useCallback??)
            // todo: prevent that previous setPublicIndex() never execute after succeeding setPublicIndex().
            // todo: determine ownership without receiving full publicArticle.

            getPublicArticle(article.publicIndex, localIndex!)
                .then(publicArticle => {
                    if(publicArticle === undefined) return;

                    if(publicArticle.localIndex === localIndex){
                        setPublicIndex(article.publicIndex);
                    }
                });
        }

        return article;
    }, [localIndex]);

    if(loading) return <Loading />;
    if(article === undefined){
        return <Layout title='오류' sidebar='ArticleList'>
            <p>존재하지 않는 글입니다.</p>
        </Layout>;
    }

    return <Layout /* title={ article.metadata.title } */ sidebar='ArticleList'>
        <div className='article'>
            <div className='articleButtonContainer'>
                <Link to={ `/article/update/${ localIndex }` }>
                    <Button className='articleButton'>
                        <Icon>edit</Icon>
                    </Button>
                </Link>
                { publicIndex === undefined && ( //unpublished OR forked
                    <>
                        <Button className='articleButton'
                            onClick={ async () => {
                                await removeLocalArticle(localIndex!);

                                navigate(`/article/list`);
                            } }
                        >
                            <Icon>delete</Icon>
                        </Button>
                        <Button className='articleButton'
                            onClick={ async () => {
                                await postPublicArticle(article!);

                                navigate(`/article/view/${localIndex}`);
                            } }
                        >
                            <Icon>publish</Icon>
                        </Button>
                        { article.publicIndex !== undefined && // forked
                            <Link to={ `/article-pub/view/${article.publicIndex}` }>
                                <Button className='articleButton'>
                                    원본 글 보기
                                </Button>
                            </Link>
                        }
                    </>
                )}
                { publicIndex !== undefined && ( //owner and published
                    <>
                        <Button className='articleButton'
                            onClick={ async () => {
                                // when published, delete both the local AND public articles
                                if(!window.confirm('공개된 게시글이 모두 사라집니다. 괜찮으시겠습니까?')) return;

                                await removeLocalArticle(localIndex!);
                                await removePublicArticle(publicIndex!, localIndex);

                                navigate(`/article/list`);
                            } }
                        >
                            <Icon>delete</Icon>
                        </Button>
                        <Button className='articleButton'
                            onClick={ async () => {
                                updatePublicArticle(publicIndex!, article!);
                            } }
                        >
                            <Icon>sync</Icon>
                        </Button>
                        <Link to={ `/article-pub/view/${publicIndex}` }>
                            <Button className='articleButton'>
                                공개 글 보기
                            </Button>
                        </Link>
                    </>
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