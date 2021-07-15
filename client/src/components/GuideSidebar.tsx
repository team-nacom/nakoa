import useScroll from 'etc/useScroll';
import React from 'react';

interface Props {
    children?: React.ReactNode;
    on: 'list' | 'post'
}

function GuideSidebar({ children, on = 'post' } : Props) {
    let scroll = useScroll();

    return (
        <div className={'guideSidebar' + (scroll >= 225 ? ' scrolledDown' : '') + ` ${on}`}>
            { children }
        </div>
    );
}


export default GuideSidebar;