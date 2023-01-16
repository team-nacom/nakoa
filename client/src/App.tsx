import React, { useMemo, useState, useCallback } from 'react'
import { Redirect, Route, Router, Switch } from 'react-router-dom'

import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';
import { createBrowserHistory } from "history";
import ReactGA from 'react-ga';

import { useLocale } from '#/store/locale'
import { localeMessages } from '#/locale'

import Header from '#/layout/Header';
import Footer from '#/layout/Footer';

import Main from '#/pages/Main';
import Hidden from '#/pages/Hidden';
import WriteClassic from './pages/WriteClassic';
import WriteCell from '#/pages/WriteCell';
import NotFound from '#/pages/NotFound';
import About from '#/pages/About';

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
                {/* Layout */}
                <Header />
                <div id='content'>
                    <Switch>
                        <Redirect exact path='/' to='/main' />
                        <Route exact path='/main' component={Main} />
                        <Route exact path='/about' component={About}/>

                        <Route exact path='/write-classic' component={WriteClassic} />
                        <Route exact path='/write-cell' component={WriteCell} />

                        <Route exact path='/hidden' component={Hidden} />
                        <Route component={NotFound}/>
                    </Switch>
                </div>
                <Footer />
            </Router>
        </IntlProvider>
    )
}

export default App;