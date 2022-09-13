import React, { useRef, useEffect } from 'react';

import { useAliveScope } from './AliveScope';

type KeepAliveProps = React.PropsWithChildren<{
    id: string
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

    return <div className="keepAlive" ref={keepAliveRef} />;
};

export default KeepAlive;