import React from 'react';

interface Params {
    style?: object;
    children: any;
}

function PageTitle({style, children} : Params) {
    return (
        <h2 className='pageTitle' style={ style }>
            {children}
        </h2>
    )
}

export default PageTitle;