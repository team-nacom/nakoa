import React from 'react'
import ReactDOM from 'react-dom/client'
import '#/styles/index.scss'

import App from './App'

import { Provider } from 'react-redux'
import store from '#/store'

import ReactGA from 'react-ga'
import config from '#/misc/config';

ReactGA.initialize(config.googleAnalyticsTrackingId);

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')
const root = ReactDOM.createRoot(rootElement)

root.render(
    <Provider store={store}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </Provider>
)

// TODO : migrate BOTH redux AND react context providers into zustand
// https://github.com/pmndrs/zustand