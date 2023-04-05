import React from 'react'
import ReactDOM from 'react-dom/client'

import {
    createBrowserRouter,
    RouterProvider
} from 'react-router-dom';

import routes from '#/pages/routes';
import ReactGA from 'react-ga';

import * as config from '#/config/env';

import './locale'; // react-i18n initialization

import '#/styles/index.scss';

// const { t, i18n } = useTranslation();
// t('key') // to use locale
// i18n.changeLanguage('ko'); // to change locale

const router = createBrowserRouter(routes, { basename: config.baseUrl });

ReactGA.initialize(config.googleAnalyticsTrackingId);
// todo : since react-router-dom v6.4~ doesn't support history object,
// we need to attach it somewhere (using useLocation)

// history.listen((location: any) => {
//     console.log(location.pathname);
//     ReactGA.set({ page: location.pathname });
//     ReactGA.pageview(location.pathname);
// });

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);