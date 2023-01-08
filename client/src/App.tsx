import React, { useMemo, useState, useCallback } from 'react'
import { Redirect, Route, Router, Switch } from 'react-router-dom'

import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';
import { createBrowserHistory } from "history";
import ReactGA from 'react-ga';

import { useLocale } from '#/store/locale'
import { localeMessages } from '#/locale'

import Hidden from '#/pages/Hidden'
import Write from '#/pages/Write'
import NotFound from '#/pages/NotFound'
import About from '#/pages/About'
import WriteClassic from './pages/WriteClassic'

function App() {
    const { locale } = useLocale()

    const history = createBrowserHistory();
    history.listen((location: any) => {
        console.log(location.pathname);
        ReactGA.set({ page: location.pathname });
        ReactGA.pageview(location.pathname);
    })
    return (
        <IntlProvider locale={locale} messages={localeMessages[locale]}>
            <Router history={history}>
                <Switch>
                    <Redirect exact path='/' to='/write-classic' />
                    <Route exact path='/hidden' component={Hidden} />
                    <Route exact path='/write' component={Write} />
                    <Route exact path='/write-classic' component={WriteClassic} />
                    <Route exact path='/about' component={About}/>
                    <Route component={NotFound}/>
                </Switch>
            </Router>
        </IntlProvider>
    )
}

export default App;