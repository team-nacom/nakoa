import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
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
import About from 'pages/About'
import GuideEdit from 'pages/guide/GuideEdit';

import messageEn from './locale/en.json';
import messageKo from './locale/ko.json';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';
import { RootReducer } from 'store';
import SignUpVerify from 'pages/signup/SignupVerify';
import SignUpPending from 'pages/signup/SignupPending';

const localeMessages = {
  'en': messageEn,
  'ko': messageKo
} as const;

function App() {
  let [userInfoLoading] = usePromise(() => setUserInfo());
  let locale = useSelector((state: RootReducer) => state.locale.locale);

  if (userInfoLoading) return <></>;
  else return (
    <IntlProvider locale={locale} messages={localeMessages[locale]}>
      <BrowserRouter>
        <Switch>
          <Route path='/challenge/:id/submit' component={ChallengeSubmit} />
          <Route path='/challenge/:id/solution' component={ChallengeSolution} />
          <Route path='/challenge/:id/submissions' component={ChallengeSubmissions} />
          <Route path='/challenge/:id' component={ChallengeView} />
          <Route path='/challenge' component={ChallengeList} />
          <Route path='/guide/write' component={GuideWrite} />
          <Route path='/guide/:id/edit' component={GuideEdit} />
          <Route path='/guide/:id' component={Guide} />
          <Route path='/guide' component={GuideList} />
          <Redirect path='/problem' to='/challenge' />
          <Redirect path='/challenges' to='/challenge' />
          <Route path='/quiz/:id' component={QuizView} />
          <Redirect path='/quiz' to='/quiz/1'/>
          <Route path='/quiz/write' component={QuizWrite} />
          <Route path='/challenge/write' component={ChallengeWrite} />
          <Route path='/signup/done' component={SignUpDone} />
          <Route path='/signup/pending' component={SignUpPending} />
          <Route path='/signup/verify/:email/:code' component={SignUpVerify} />
          <Route path='/signup' component={SignUp} />
          <Route path='/logout' component={Logout} />
          <Route path='/about' component={About} />
          <Redirect path='/' to='/guide' />
{/*          <Route path='/' component={Main} /> */}
        </Switch>
      </BrowserRouter>
    </IntlProvider>    
  );
}

export default App;
