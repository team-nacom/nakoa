import React from 'react';
import ReactDOM from 'react-dom';
import 'styles/index.scss';
import App from 'App';
import reportWebVitals from 'reportWebVitals';
import store from 'store';
import { Provider } from 'react-redux';

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// service worker registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function (registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function (err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}