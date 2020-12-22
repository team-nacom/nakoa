import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Main from 'pages/Main';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' component={Main} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
