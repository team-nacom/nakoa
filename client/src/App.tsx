import React, { useMemo, useState, useCallback } from 'react'
import { Redirect, Route, Router, Switch } from 'react-router-dom'

import { IntlProvider } from 'react-intl';
import { createBrowserHistory } from "history";
import ReactGA from 'react-ga';

import { useLocale } from '#/store/locale'
import { localeMessages } from '#/locale'

import Main from '#/pages/Main';
import NotFound from '#/pages/NotFound';
import About from '#/pages/About';

import ArticleList from '#/pages/article/List';
import ArticleView from '#/pages/article/View';
import ArticleUpdate from '#/pages/article/Update';
import ArticleDelete from '#/pages/article/Delete';
import WriteClassic from './pages/article/WriteClassic';
import WriteCell from '#/pages/article/WriteCell';
import Hidden from '#/pages/article/Hidden';

import { baseUrl } from '#/config/env';

function App() {
    const { locale } = useLocale();

    const history = createBrowserHistory({ basename: baseUrl });
    history.listen((location: any) => {
        console.log(location.pathname);
        ReactGA.set({ page: location.pathname });
        ReactGA.pageview(location.pathname);
    });
    return (
        <IntlProvider locale={locale} messages={localeMessages[locale]}>
            <Router history={history}>
                {/* Layout is included in each component */}
                <Switch>
                    <Redirect exact path='/' to='/main' />
                    <Route exact path='/main' component={Main} />
                    <Route exact path='/about' component={About}/>

                    <Route exact path='/article/list' component={ArticleList} />
                    <Route exact path='/article/view/:index' component={ArticleView} />
                    <Route exact path='/article/update/:index' component={ArticleUpdate} />
                    <Route exact path='/article/delete/:index' component={ArticleDelete} />
                    <Route exact path='/article/write-classic' component={WriteClassic} />
                    <Route exact path='/article/write-cell' component={WriteCell} />

                    <Route exact path='/hidden' component={Hidden} />
                    <Route component={NotFound}/>
                </Switch>
            </Router>
        </IntlProvider>
    )
}

export default App;