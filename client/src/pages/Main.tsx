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

export default ApplyLayout({ Content: Main });