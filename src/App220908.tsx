import React, { useState, useCallback } from 'react'

import Dummy from '#/components/Dummy'

import { AliveScope } from '#/components/KeepAlive/AliveScope';
import KeepAlive from '#/components/KeepAlive/KeepAlive';

const MemoDummy = React.memo(Dummy)

function App() {
    const [ cnt, setCnt ] = useState(0)
    const increaseCnt = useCallback(()=>{
        setCnt(c => c+1);
    }, []);

    return (
        <AliveScope>
            <div style={ { border: '1px solid green', height: '80px' } }>
                { cnt % 3 === 0 && (
                    <KeepAlive id={1}>
                        <Dummy text="aaaa" />
                    </KeepAlive>
                ) }
            </div>
            <div style={ { border: '1px solid blue', height: '80px' } }>
                { cnt % 3 === 2 && (
                    <KeepAlive id={1}>
                        <Dummy text="bbbb" />
                    </KeepAlive>
                ) }
            </div>
            <button onClick={increaseCnt}>Click me!</button>
        </AliveScope>
    );
}

export default App;

// if child components are memoized, then parent rerendering doesn't invoke children rerendering.
// however,,,,