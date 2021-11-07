import React from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import Main from 'pages/Main';
import ChallengeList from 'pages/challenge/ChallengeList';
import ChallengeView from 'pages/challenge/ChallengeView';
import ChallengeSubmit from 'pages/challenge/ChallengeSubmit';
import SignUp from 'pages/signup/Signup';
import QuizView from 'pages/quiz/QuizView';
import ChallengeSubmissions from 'pages/challenge/ChallengeSubmissions';
import ChallengeSolution from 'pages/challenge/ChallengeSolution';
import QuizWrite from 'pages/quiz/QuizWrite';
import ChallengeWrite from 'pages/challenge/ChallengeWrite';
import Guide from 'pages/guide/Guide';
import usePromise from 'etc/usePromise';
import { setUserInfo } from 'etc/api/user';
import Logout from 'pages/Logout';
import SignUpDone from 'pages/signup/SignupDone';
import GuideList from 'pages/guide/GuideList';
import GuideWrite from 'pages/guide/GuideWrite';
import About from 'pages/About';
import NotFound from 'pages/NotFound';
import GuideEdit from 'pages/guide/GuideEdit';
import BubbleList from 'pages/bubble/BubbleList';

import messageEn from './locale/en.json';
import messageKo from './locale/ko.json';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';
import { RootReducer } from 'store';
import SignUpVerify from 'pages/signup/SignupVerify';
import SignUpPending from 'pages/signup/SignupPending';
import { createBrowserHistory } from "history";
import ReactGA from 'react-ga';
import MyPage from 'pages/user/Mypage';
import GuideGallary from 'components/GuideGallary';
import BubbleWrite from 'pages/bubble/BubbleWrite';
import User from 'pages/user/User';

const localeMessages = {
  'en': messageEn,
  'ko': messageKo
} as const;


function App() {
  let [userInfoLoading] = usePromise(() => setUserInfo());
  let locale = useSelector((state: RootReducer) => state.locale.locale);

  const history = createBrowserHistory();
  history.listen((location: any) => {
    console.log(location.pathname);
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  })

  if (userInfoLoading) return <></>;
  else return (
    <IntlProvider locale={locale} messages={localeMessages[locale]}>
      <Router history={history}>
        <Switch>
          
{/*          <Route path='/challenge/:id/submit' component={ChallengeSubmit} />
          <Route path='/challenge/:id/solution' component={ChallengeSolution} />
          <Route path='/challenge/:id/submissions' component={ChallengeSubmissions} />
          <Route path='/challenge/:id' component={ChallengeView} />
          <Route path='/challenge/write' component={ChallengeWrite} />
          <Route path='/challenge' component={ChallengeList} />
          <Redirect path='/problem' to='/challenge' />
          <Redirect path='/challenges' to='/challenge' />*/}

{/*          <Route path='/quiz/:id' component={QuizView} />
          <Redirect path='/quiz' to='/quiz/1'/>
          <Route path='/quiz/write' component={QuizWrite} />*/}

          <Route exact path='/user/:nickname/:menu' component={User} />
          <Route exact path='/user/:nickname' component={User} />
          <Route exact path='/user' component={MyPage} />
          <Route exact path='/guide/write' component={GuideWrite} />
          <Route exact path='/guide/:id(\d+)/edit' component={GuideEdit} />
          <Route exact path='/guide/:id(\d+)' component={Guide} />
          <Route exact path='/guide' component={GuideList} />
          <Route exact path='/guide/list1' component={GuideGallary} />
          <Route exact path='/mypage' component={MyPage} />
          <Route exact path='/signup/done' component={SignUpDone} />
          <Route exact path='/signup/pending' component={SignUpPending} />
          <Route exact path='/signup/verify/:email/:code' component={SignUpVerify} />
          <Route exact path='/signup' component={SignUp} />
          <Route exact path='/logout' component={Logout} />
          <Route exact path='/about' component={About} />
          <Route exact path='/bubble' component={BubbleList} />
          <Route exact path='/bubble/write' component={BubbleWrite} />
          <Redirect exact path='/' to='/guide' />
{/*          <Route path='/' component={Main} /> */}
          <Route component={NotFound}/>
        </Switch>
      </Router>
    </IntlProvider>    
  );
}

export default App;
