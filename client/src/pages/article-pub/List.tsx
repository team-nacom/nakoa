import React, { useState, useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';

import Loading from '../Loading';
import Button from '#/components/Button';
import { Layout } from '#/layout/Layout';

import usePromise from '#/misc/usePromise';
import { getPublicArticleList } from '#/api/article-public';

import { Icon } from '@mui/material';


function List() {
    let [loading, articles] = usePromise(() => getPublicArticleList(), []);

    if(loading) return <Loading />;
    if(articles === undefined){
        return <Layout title='오류'>
            글을 불러오지 못했습니다.
        </Layout>;
    }

    return <Layout title='모든 공개 글 보기' /* sidebar='ArticleList' */>
        
        <div className='articleListButtonContainer'>
            <span className='articleCount'>
                { `총 ${articles.length}개` }
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
    </Layout>;
}

export default List;