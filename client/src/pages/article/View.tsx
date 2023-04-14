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

    const fileMap = useMemo(()=>{
        if(!article) return {};
        const keys = article.filePaths ?? [];
        const values = article.files ?? []; // might not have been initialized.

        return Object.fromEntries(keys.map((k, i) => [k, values[i]]));
    }, [article?.filePaths, article?.files]);

    if(loading) return <Loading />;
    if(article === undefined){
        return <Layout title='오류' sidebar='ArticleList'>
            <p>존재하지 않는 글입니다.</p>
        </Layout>;
    }

    return <Layout /* title={ article.metadata.title } */ sidebar='ArticleList'>
        <div className='article'>
            <div className='articleButtonContainer'>
                <Button className='articleButton'
                    to={ `/article/update/${ localIndex }` }
                >
                    <Icon>edit</Icon>
                    <span>글 수정</span>
                </Button>
                { publicIndex === undefined && ( //unpublished OR forked
                    <>
                        <Button className='articleButton'
                            onClick={ async () => {
                                await removeLocalArticle(localIndex!);

                                navigate(`/article/list`);
                            } }
                        >
                            <Icon>delete</Icon>
                            <span>글 삭제</span>
                        </Button>
                        <Button className='articleButton'
                            onClick={ async () => {
                                await postPublicArticle(article!);

                                navigate(`/article/view/${localIndex}`);
                            } }
                        >
                            <Icon>publish</Icon>
                            <span>글 공개</span>
                        </Button>
                        { article.publicIndex !== undefined && // forked
                            <Button className='articleButton'
                                to={ `/article-pub/view/${article.publicIndex}` }
                            >
                                <Icon>public</Icon>
                                <span>원본 글 보기</span>
                            </Button>
                        }
                    </>
                )}
                { publicIndex !== undefined && ( //owner and published
                    <>
                        <Button className='articleButton'
                            onClick={ async () => {
                                // when published, delete both the local AND public articles
                                if(!window.confirm('글이 삭제됨과 동시에 공개 글이 철회됩니다. 괜찮으시겠습니까?')) return;

                                // todo: transaction.
                                let { success } = await removePublicArticle(publicIndex!, localIndex); // withdraw first.
                                if(!success){
                                    alert('공개 글 철회를 실패했습니다. 인터넷 상태를 확인하고 다시 시도해 주세요.');
                                    return;
                                }
                                await removeLocalArticle(localIndex!);
                                navigate(`/article/list`);
                            } }
                        >
                            <Icon>delete</Icon>
                            <span>삭제 및 철회</span>
                        </Button>
                        <Button className='articleButton'
                            onClick={ async () => {
                                updatePublicArticle(publicIndex!, article!);
                            } }
                        >
                            <Icon>update</Icon>
                            <span>수정내용 반영</span>
                        </Button>
                        <Button className='articleButton'
                            to={ `/article-pub/view/${publicIndex}` }
                        >
                            <Icon>public</Icon>
                            <span>공개 글 보기</span>
                        </Button>
                    </>
                )}
            </div>
            <div className='articleContentMain'>
                <h1 className='title'> { article.metadata.title } </h1>
                {/* <h2 className='subtitle'> { article.metadata.author } </h2> */}
                {article.mode === 'classic' && (
                    <Markdown fileMap={ fileMap }>
                        { article.text }
                    </Markdown>
                ) }
                {article.mode === 'cell' && (
                    <Display // TODO : fileMap here
                        {...article.content}
                    />
                ) }
            </div>

            {/* <div className='articleBackground' /> */}

        </div>
    </Layout>;
}

export default View;