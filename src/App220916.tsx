import React, { useState, useReducer, useCallback, createContext, useContext, useMemo, memo } from 'react'


import { HtmlPortalNode, createHtmlPortalNode, InPortal, OutPortal } from 'react-reverse-portal'

interface Action{
    id: string,
    value: string
}
const reducer = (state: Record<string, string>, action: Action) => {
    return {
        ...state,
        [action.id]: action.value
    }
}

const DataEditScopeContext = createContext(
    (a: Action)=>{}
)

interface BoxProps { id:string, txt: string }
function Box({ id, txt }: BoxProps) {
    const dispatch = useContext(DataEditScopeContext)
    const changeHandler = (e : React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        dispatch({ id, value: e.target.value})
    }

    return <div style={ {border:'1px solid red'} }>
        <textarea
            value = { txt }
            onChange = { changeHandler }
        />
        <br />
        <strong>{ txt }</strong>
        <br />
        { Date.now() }
    </div>
}
const MemoBox = memo(Box)

function idToNodes(prev: Record<string, HtmlPortalNode>, newIds: string[]): Record<string, HtmlPortalNode>{
    const next = newIds.reduce( (acc, id)=>{
        if(!acc[id]){
            return { ...acc, [id] : createHtmlPortalNode() }
        }
        return acc
    }, Object.fromEntries(Object.entries(prev).filter(([k]) => (newIds.indexOf(k) !== -1)  )))
    // }, prev)
    return next
}

const arr1 = ['1']
const arr2 = ['3', '2']
const arr3 = ['1', '2', '3']

function App() {
    const initVals = {
        '1' : 'aa',
        '2' : 'bb',
        '3' : 'cc'
    } as Record<string,string>
    const [ vals, dispatch ] = useReducer(reducer, initVals)

    const [ arr, setArr ] = useState(arr1)
    const [ cnt, setCnt ] = useState(0)

    const initNodes = useMemo(()=>{
        // return idToNodes({}, arr1)
        return idToNodes({}, arr3)
    }, [])

    const [ nodes, setNodes ] = useState(initNodes)

    const toggle = useCallback(() => {
        let newArr = (cnt % 3 === 0 ? arr2 : (cnt % 3 === 1 ? arr3 : arr1));

        setArr( newArr );
        setNodes( prev => idToNodes(prev, newArr) );
        setCnt(cnt => cnt + 1);
    }, [cnt])

    return (
        <>
            <DataEditScopeContext.Provider value = { dispatch }>
            {
                arr.map( (elem) => (
                    <InPortal key={elem} node = { nodes[elem] }>
                        <MemoBox id={elem} txt={vals[elem]} />
                    </InPortal>
                ) )
            }
            </DataEditScopeContext.Provider>

            <button onClick={ toggle }>Click me!</button>

            <div style={ {border:'1px solid purple', padding:'10px', minHeight: '100px'} }>
                { (cnt % 2 === 0) &&
                    (
                        arr.map( (elem) => (
                            <OutPortal key={elem} node = { nodes[elem] } />
                        ) )
                    )
                }
            </div>
            <div style={ {border:'1px solid purple', padding:'10px', minHeight: '100px'} }>
                { (cnt % 2 === 1) &&
                    (
                        arr.map( (elem) => (
                            <OutPortal key={elem} node = { nodes[elem] } />
                        ) )
                    )
                }
            </div>
        </>
    );
}

export default App;
