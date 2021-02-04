import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Main from 'pages/Main';
import ChallengeList from 'pages/ChallengeList';
import ChallengeView from 'pages/ChallengeView';
import ChallengeSubmit from 'pages/ChallengeSubmit';
import SignUp from 'pages/SignUp';
import QuizView from 'pages/QuizView';
import ChallengeSubmissions from 'pages/ChallengeSubmissions';
import ChallengeSolution from 'pages/ChallengeSolution';
import AdminAddQuiz from 'pages/AdminAddQuiz';
import AdminAddChallenge from 'pages/AdminAddChallenge';
import BlogPage from 'pages/BlogPage';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/challenge/:id/submit' component={ChallengeSubmit} />
        <Route path='/challenge/:id/solution' component={ChallengeSolution} />
        <Route path='/challenge/:id/submissions' component={ChallengeSubmissions} />
        <Route path='/challenge/:id' component={ChallengeView} />
        <Route path='/challenge' component={ChallengeList} />
        <Route path='/blog' component={BlogPage} />
        <Redirect path='/problem' to='/challenge' />
        <Redirect path='/challenges' to='/challenge' />
        <Route path='/quiz/:id' component={QuizView} />
        <Redirect path='/quiz' to='/quiz/1'/>
        <Route path='/admin/quiz/add' component={AdminAddQuiz} />
        <Route path='/admin/challenge/add' component={AdminAddChallenge} />
        <Route path='/signup' component={SignUp} />
        <Route path='/' component={Main} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
