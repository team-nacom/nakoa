import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';


import Main from '#/pages/Main';
import NotFound from '#/pages/NotFound';
import About from '#/pages/About';

import ArticleList from '#/pages/article/List';
import ArticleView from '#/pages/article/View';
import ArticleUpdate from '#/pages/article/Update';
import ArticleWriteClassic from '#/pages/article/WriteClassic';
import ArticleWriteCell from '#/pages/article/WriteCell';
import Hidden from '#/pages/article/Hidden';

import ArticlePubList from '#/pages/article-pub/List';
import ArticlePubView from '#/pages/article-pub/View';

const routes: RouteObject[] = [
    { path: '/', 
        children: [
            { path: '', element: <Navigate to='/main' /> },

            { path: 'main', element: <Main /> },
            { path: 'about', element: <About /> },

            { path: 'article',
                children: [
                    { path: 'list', element: <ArticleList /> },
                    { path: 'view/:localIndex', element: <ArticleView /> },
                    { path: 'update/:localIndex', element: <ArticleUpdate /> },
                    { path: 'write-classic', element: <ArticleWriteClassic /> },
                    { path: 'write-cell', element: <ArticleWriteCell /> },
                ]
            },

            { path: 'article-pub',
                children: [
                    { path: 'list', element: <ArticlePubList /> },
                    { path: 'view/:publicIndex', element: <ArticlePubView /> },
                ]
            },

            { path: 'hidden', element: <Hidden /> },
        ]
    },

    // not found
    { path: '*', element: <NotFound /> },
];

export default routes;