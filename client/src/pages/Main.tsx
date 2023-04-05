import React from 'react';
// import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

import { Layout } from '#/layout/Layout';

function Main() {
    let { i18n } = useTranslation('translation');

    return <Layout title={ i18n.t('team') ?? undefined } sidebar='ArticleList'>
        <p>{ i18n.t('main.greeting') }</p>
    </Layout>;
}

export default Main;

/*

https://github.com/team-nacom/nakoa/blob/2f279ea8335995a722ccf01896deb5364c405ba2/client/src/pages/guide/GuideList.tsx
https://github.com/team-nacom/nakoa/blob/f303e0e90fd89d90d948408a200ec159865316b6/client/src/pages/Cell/CellList.tsx

*/