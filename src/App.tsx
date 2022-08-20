import React, { useState } from 'react'

import Dummy from '#components/Dummy'

const MemoDummy = React.memo(Dummy);

function App() {
    const txtsA = ['aaa', 'bbb', 'ccc']
    const txtsB = ['aaa', 'bbb', 'ccc', 'ddd']
    const txtsC = ['eee', 'aaa', 'bbb', 'ccc']

    const [ txts, setTxts ] = useState(txtsA)
    const [ cnt, setCnt ] = useState(0)

    return (
        <div className="App">
            <button onClick={(e)=>{
                switch(cnt % 3){
                case 0: setTxts(txtsB); break
                case 1: setTxts(txtsC); break
                case 2: setTxts(txtsA); break
                }
                setCnt(cnt + 1)
            }}>click me!</button>
            {
                txts.map((txt)=>(
                    <MemoDummy key={ txt } text={ txt } />
                ))
            }
        </div>
    );
}

export default App;
