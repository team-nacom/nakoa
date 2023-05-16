import React, { useState, useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';

import Loading from '../Loading';
import Button from '#/components/Button';
import { Layout } from '#/layout/Layout';

import usePromise from '#/misc/usePromise';
import { getLocalArticleCount, getLocalArticleList } from '#/api/article-local-idb';
// import Markdown from '#/components/markdown-lab/Markdown';
// import { Display } from '#/components/cell-editor/cell/Display';

import { Icon } from '@mui/material';
import { PAGE_SIZE } from '#/common/consts';

function List() {
    const { page: pgstr } = useParams<{ page: string }>();
    const page = Math.abs(+(pgstr || 0)); // default behavior : show first(#0) page.

    let [loading, articles] = usePromise(() => getLocalArticleList(page), [page]);
    let [countLoading, count] = usePromise(() => getLocalArticleCount(), []);
    
    if(loading) return <Loading />;
    if(articles === undefined){
        return <Layout title='오류'>
            글을 불러오지 못했습니다.
        </Layout>;
    }

    return <Layout title='모든 글 보기' /* sidebar='ArticleList' */>
        
        <div className='articleListButtonContainer'>
            <span className='articleCount'>
                { `총 ${count !== undefined ? count : '?'}개` }
            </span>
            <Button to='/article/write-classic'>
                <Icon>text_fields</Icon>
            </Button>
            <Button to='/article/write-cell'>
                <Icon>dynamic_feed</Icon>
            </Button>
        </div>
        {(countLoading || count! > 0) &&
            <>
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
                <div className='pagination'>
                    { page > 0 && (
                        <Button to={ `/article/list/${page-1}` }>
                            이전 페이지
                        </Button>
                    )}
                    <span>{ page }</span>
                    { page < Math.ceil( (count ?? 0) / PAGE_SIZE ) &&
                        <Button to={ `/article/list/${page+1}` }>
                            다음 페이지
                        </Button>
                    }
                </div>
            </>
        }
        {count === 0 &&
            <div>
                아직 글이 없습니다. 새 글을 작성해 보세요!
            </div>
        }

    </Layout>;
}

export default List;