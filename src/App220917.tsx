import React, { useState, useCallback, useMemo, memo } from 'react'
import { createHtmlPortalNode, InPortal, OutPortal } from 'react-reverse-portal'

interface BoxProps { txt: string }
function Box({ txt }: BoxProps) {

    const [time, setTime] = useState(0)

    React.useEffect(()=>{
        console.log('mounted!')
        setTime(Date.now())
    }, [])

    return <div style={ {border:'1px solid red'} }>
        <strong>{ txt }</strong>
        <br />
        { Date.now() }
    </div>
}
const MemoBox = memo(Box)

function App() {
    const [ show, setShow ] = useState(true)
    const node1 = useMemo(createHtmlPortalNode, [])
    const node2 = useMemo(createHtmlPortalNode, [])
    const toggle = useCallback(() => {
        setShow(show => !show);
    }, [])

    return (
        <>
            <MemoBox txt="hey!" />
            <InPortal node = { node1 }>
                <MemoBox key = '1' txt = 'hello!' />
            </InPortal>
            <InPortal node = { node2 }>
                <MemoBox key = '2' txt = 'bye!' />
            </InPortal>

            <button onClick={ toggle }>Click me!</button>

            { show && <OutPortal node = { node1 } /> }
            { show && <OutPortal node = { node2 } /> }
            <hr />
            <div style={ { display: 'none'} } >
                { !show && <OutPortal node = { node1 } /> }
            </div>
            { !show && <OutPortal node = { node2 } /> }
        </>
    );
}

export default App;
