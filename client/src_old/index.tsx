import React from 'react';
import ReactDOM from 'react-dom';
import 'styles/index.scss';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';
import ReactGA from 'react-ga';
import config from './etc/config';

ReactGA.initialize(config.googleAnalyticsTrackingId);

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);
