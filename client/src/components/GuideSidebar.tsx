import useScroll from 'etc/useScroll';
import React from 'react';

interface Props {
    children?: React.ReactNode;
}

function GuideSidebar({ children } : Props) {
    let scroll = useScroll();

    return (
        <div className={'guideSidebar' + (scroll >= 225 ? ' scrolledDown' : '')}>
            { children }
        </div>
    );
}


export default GuideSidebar;