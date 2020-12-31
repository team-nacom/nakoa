import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Main from 'pages/Main';
import ChallengeList from 'pages/ChallengeList';
import Challenge from 'pages/Challenge';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/challenge/:id' component={Challenge} />
        <Route path='/challenge' component={ChallengeList} />
        <Redirect path='/problem' to='/challenge' />
        <Route path='/' component={Main} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
