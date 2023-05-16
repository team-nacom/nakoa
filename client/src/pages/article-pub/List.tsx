import React, { useState, useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';

import Loading from '../Loading';
import Button from '#/components/Button';
import { Layout } from '#/layout/Layout';

import usePromise from '#/misc/usePromise';
import { getPublicArticleCount, getPublicArticleList } from '#/api/article-public-with-file';

import { Icon } from '@mui/material';
import { PAGE_SIZE } from '#/common/consts';


function List() {
    const { page: pgstr } = useParams<{ page: string }>();
    const page = Math.abs(+(pgstr || 0)); // default behavior : show first(#0) page.

    let [loading, articles] = usePromise(() => getPublicArticleList(page), [page]);
    let [countLoading, count] = usePromise(() => getPublicArticleCount(), []);

    if(loading) return <Loading />;
    if(articles === undefined){
        return <Layout title='오류'>
            글을 불러오지 못했습니다.
        </Layout>;
    }

    return <Layout title='모든 공개 글 보기' /* sidebar='ArticleList' */ bgClass='published'>
        
        <div className='articleListButtonContainer'>
            <span className='articleCount'>
                { `총 ${count !== undefined ? count : '?'}개` }
            </span>
            {/* <Link to='/article/write-classic'>
                <Button>
                    <Icon>text_fields</Icon>
                </Button>
            </Link>
            <Link to='/article/write-cell'>
                <Button>
                    <Icon>dynamic_feed</Icon>
                </Button>
            </Link> */}
        </div>
        {(countLoading || count! > 0) &&
            <>
                <div className='articleFeedList'>
                    {articles.map((article, no) => (
                        <div key={ no } className='articleFeed'>
                            <Link to={ `/article-pub/view/${ article.publicIndex! }` }>
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
                        <Link to={ `/article-pub/list/${page-1}` }>
                            ◀이전
                        </Link>
                    )}
                    <span> { page }페이지 </span>
                    { page < Math.ceil( (count ?? 0) / PAGE_SIZE ) &&
                        <Link to={ `/article-pub/list/${page+1}` }>
                            다음▶
                        </Link>
                    }
                </div>
            </>
        }
        {count === 0 &&
            <div>
                아직 글이 없습니다.
            </div>
        }
        
    </Layout>;
}

export default List;