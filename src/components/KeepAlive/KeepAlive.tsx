import React, { useRef, useEffect } from 'react';

import { useAliveScope } from './AliveScope';
import { KeepAliveKeyType } from './types'

type KeepAliveProps = React.PropsWithChildren<{
    id: KeepAliveKeyType
}>

const KeepAlive = ({id, children}: KeepAliveProps) => {
    const { getPortalElement } = useAliveScope();
    const keepAliveRef = useRef<HTMLDivElement>(null);

    const appendPortalElement = () => {
        const portalElement = getPortalElement(id, children);
        keepAliveRef.current?.appendChild(portalElement);
    };

    useEffect(() => {
        appendPortalElement();
    }, []);

    return <div ref={keepAliveRef} />;
};

export default KeepAlive;