import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Main from 'pages/Main';
import ChallengeList from 'pages/ChallengeList';
import ChallengeView from 'pages/ChallengeView';
import ChallengeSubmit from 'pages/ChallengeSubmit';
import SignUp from 'pages/SignUp';
import Quiz from 'pages/Quiz';
import ChallengeSolutions from 'pages/ChallengeSolutions';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/challenge/:id/submit' component={ChallengeSubmit} />
        <Route path='/challenge/:id/solutions' component={ChallengeSolutions} />
        <Route path='/challenge/:id' component={ChallengeView} />
        <Route path='/challenge' component={ChallengeList} />
        <Redirect path='/problem' to='/challenge' />
        <Redirect path='/challenges' to='/challenge' />
        <Route path='/quiz' component={Quiz} />
        <Route path='/signup' component={SignUp} />
        <Route path='/' component={Main} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
