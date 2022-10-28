import useScroll from 'etc/useScroll';
import React from 'react';

interface Props {
    children?: React.ReactNode;
    on: 'list' | 'post'
}

function BubbleSidebar({ children, on = 'post' } : Props) {
    let scroll = useScroll();

    return (
        <div className={'bubbleSidebar' + (scroll >= 225 ? ' scrolledDown' : '') + ` ${on}`}>
            { children }
        </div>
    );
}


export default BubbleSidebar;