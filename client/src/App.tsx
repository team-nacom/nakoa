import React from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import Main from 'pages/Main';
import Guide from 'pages/guide/Guide';
import usePromise from 'etc/usePromise';
import GuideList from 'pages/guide/GuideList';
import GuideWrite from 'pages/guide/GuideWrite';
import About from 'pages/About';
import NotFound from 'pages/NotFound';
import GuideEdit from 'pages/guide/GuideEdit';
import BubbleList from 'pages/bubble/BubbleList';
import BubblePage from 'pages/bubble/BubblePage';

import messageEn from './locale/en.json';
import messageKo from './locale/ko.json';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';
import { RootReducer } from 'store';
import { createBrowserHistory } from "history";
import ReactGA from 'react-ga';
import GuideGallary from 'components/GuideGallary';
import BubbleWrite from 'pages/bubble/BubbleWrite';
import BubbleEdit from 'pages/bubble/BubbleEdit';
import GuideSearchList from 'pages/guide/GuideSearchList';

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
          <Route exact path='/guide/write' component={GuideWrite} />
          <Route exact path='/guide/:id(\d+)/edit' component={GuideEdit} />
          <Route exact path='/guide/:id(\d+)' component={Guide} />
          <Route exact path='/guide' component={GuideList} />
          <Route exact path='/guide/search/:tag' component={GuideSearchList} />
          <Route exact path='/guide/list1' component={GuideGallary} />
          <Route exact path='/about' component={About} />
          <Route exact path='/bubble' component={BubbleList} />
          <Route exact path='/bubble/write' component={BubbleWrite} />
          <Route exact path='/bubble/:index' component={BubblePage} />
          <Route exact path='/bubble/:index/edit' component={BubbleEdit} />
          <Redirect exact path='/' to='/guide' />
{/*          <Route path='/' component={Main} /> */}
          <Route component={NotFound}/>
        </Switch>
      </Router>
    </IntlProvider>    
  );
}

export default App;
