import React from 'react';
import { useIntl } from 'react-intl';

import { Link } from 'react-router-dom'

import Button from '#/components/Button';

import { Layout, LayoutWithArticleList } from '#/layout/Layout';

function Main() {
    let intl = useIntl();
    return <LayoutWithArticleList  title='팀 나무컴퍼스 메인화면'>
        <p>{ intl.formatMessage({ id: 'main.greeting' })}</p>
    </LayoutWithArticleList>;
}

export default Main;

/*

https://github.com/team-nacom/nakoa/blob/2f279ea8335995a722ccf01896deb5364c405ba2/client/src/pages/guide/GuideList.tsx
https://github.com/team-nacom/nakoa/blob/f303e0e90fd89d90d948408a200ec159865316b6/client/src/pages/Cell/CellList.tsx

*/