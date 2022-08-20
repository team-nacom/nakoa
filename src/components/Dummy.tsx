import React from 'react'

interface CellProps {
    key: string
    text: string
}

function Dummy(props: CellProps){
    let timestamp = Date.now()

    return (
        <div style={ {border:'1px solid black', width:'400px'} }>
            { props.text }
            <br />
            { timestamp }
        </div>
    )
}

export default Dummy