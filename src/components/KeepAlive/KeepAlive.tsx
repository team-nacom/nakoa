import React, { useRef, useEffect } from 'react';

import { useAliveScope } from './AliveScope';

type KeepAliveProps = React.PropsWithChildren<{
    id: string
}>

const KeepAlive = ({id, children}: KeepAliveProps) => {
    const { getPortalElement } = useAliveScope();
    const keepAliveRef = useRef<HTMLDivElement>(null);

    // const appendPortalElement = () => {
    //     const portalElement = getPortalElement(id, children);
    //     keepAliveRef.current?.appendChild(portalElement);
    // };

    useEffect(() => {
        const portalElement = getPortalElement(id, children);
        keepAliveRef.current?.appendChild(portalElement);
    }, [children]);

    // 220915 TODO : reconciliation 도입해서 값 비교. 그러면 textarea도 no-rerender하지 않을까?
    // idea : react node를 넘겨주는 게 아니라 component와 props를 따로따로 넘겨주기. props 비교해서 다르면 리렌더.

    return <div className="keepAlive" ref={keepAliveRef} />;
};

export default KeepAlive;