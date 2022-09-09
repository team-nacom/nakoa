import React, { useEffect, useState } from 'react'

interface CellProps {
    text: string
}

function Dummy(props: CellProps){
    const timestamp = Date.now()

    const [show, setShow] = useState(false)
    useEffect(()=>{
        console.log('mounted: ', props.text)
        const timeout = setTimeout(()=>{
            setShow(true)
        }, 1000)
        return () => {
            console.log('unmounted: ', props.text)
            clearTimeout(timeout)
        }
    }, [show])

    // https://stackoverflow.com/questions/66590082/how-to-prevent-re-rendering-of-components-that-have-not-changed

    return (
        <div style={ {border:'1px solid black', width:'200px'} }>
            { props.text }
            <br />
            { show ? timestamp : 'Loading...' }
        </div>
    )
}

export default Dummy