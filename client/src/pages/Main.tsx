import React from 'react';
import { useIntl } from 'react-intl';

import { Link } from 'react-router-dom'

import Button from '#/components/Button';

import { ApplyLayout } from '#/layout/Apply';

function Main() {
    let intl = useIntl();
    return (
        <>
            <p>{ intl.formatMessage({ id: 'main.greeting' })}</p>
            <hr />
            <Link to='/write-classic'>
                <Button> 텍스트 편집기 </Button>
            </Link>
            <Link to='/write-cell'>
                <Button> 셀 편집기 </Button>
            </Link>
        </>
    );
}

export default Main;
// export default ApplyLayout({ Content: Main });

/*

https://github.com/team-nacom/nakoa/blob/2f279ea8335995a722ccf01896deb5364c405ba2/client/src/pages/guide/GuideList.tsx
https://github.com/team-nacom/nakoa/blob/f303e0e90fd89d90d948408a200ec159865316b6/client/src/pages/Cell/CellList.tsx

*/