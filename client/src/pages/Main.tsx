import React from 'react';
import { useIntl } from 'react-intl';


function Main() {
    let intl = useIntl();
    return (
        <>
            { intl.formatMessage({ id: 'main.greeting' })}
        </>
    );
}

export default Main;