import React from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import Main from 'pages/Main';
import usePromise from 'etc/usePromise';
import About from 'pages/About';
import NotFound from 'pages/NotFound';
import Hidden from 'pages/Hidden'; //Testing page

import messageEn from './locale/en.json';
import messageKo from './locale/ko.json';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';
import { RootReducer } from 'store';
import { createBrowserHistory } from "history";
import ReactGA from 'react-ga';
import CellPage from 'pages/Cell/CellPage';
import CellList from 'pages/Cell/CellList';
import CellWrite from 'pages/Cell/CellWrite';

const localeMessages = {
  'en': messageEn,
  'ko': messageKo
} as const;


function App() {
  let locale = useSelector((state: RootReducer) => state.locale.locale);

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
          <Redirect exact path='/' to='/write' />
          <Route exact path='/hidden' component={Hidden} />
          <Route exact path='/about' component={About} />

          <Route exact path='/write' component={CellWrite} />
          <Route exact path='/view/:index' component={CellPage} />
          <Route exact path='/list/:author?' component={CellList} />
          <Route component={NotFound}/>
        </Switch>
      </Router>
    </IntlProvider>    
  );
}

export default App;
