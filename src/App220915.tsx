import React, { useState, useEffect, createContext, useContext, useRef, PropsWithChildren, ReactNode } from 'react'
import { createPortal } from 'react-dom';

interface CacheStore{
    [id: string]: {
        children: React.ReactNode,
        element: HTMLDivElement
    }
}

const MyScopeContext = createContext({
    getCache: (id: string, children: ReactNode)=>(document.createElement('div'))
})

function foo(c: React.ReactNode, el: HTMLDivElement){
    console.log(el.id, 'portal created with', (c as any).props)
    return createPortal(c, el)
}

function MyScope({ children }: PropsWithChildren){
    const [ cache, setCache ] = useState<CacheStore>({})

    function getCache(id: string, children: ReactNode){
        let element : HTMLDivElement
        if(!cache[id]){
            element = document.createElement('div');
            element.id = `my-${ id }`
        } else {
            element = cache[id].element
        }
        console.log('cache set with', (children as any).props )
        setCache((prevCache) => ({
            ...prevCache,
            [id]: { children, element }
        }));
        return element
    }

    return (
        <MyScopeContext.Provider
            value={ { getCache } }
        >
            { children }
            {Object.entries(cache).map(([id, { children: c, element: el }]) => (
                <React.Fragment key={id}>
                    {/* { createPortal(c, el) } */}
                    { foo(c, el) }
                </React.Fragment>
            ))}
        </MyScopeContext.Provider> 
    )
}

type KeepAliveProps = React.PropsWithChildren<{
    id: string
}>

const KeepAlive = ({id, children}: KeepAliveProps) => {
    const { getCache } = useContext(MyScopeContext);
    const keepAliveRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log(children)
        const portalElement = getCache(id, children);
        keepAliveRef.current?.appendChild(portalElement);
    }, [children, id]);

    return <div className="keepAlive" ref={keepAliveRef} />;
}

const DataScopeContext = createContext('')
const DataEditScopeContext = createContext(
    (txt: string)=>{}
)

// Box에서 txt를 props로 받으니까 rerender가 강제되는 것 아닐까. 안쪽에 textarea가 있는 이상 어쩔 수 없는 것 같다.

interface BoxProps { txt: string }
function Box({ txt }: BoxProps) {
    // function Box() {
    // const txt = useContext(DataScopeContext)
    const setTxt = useContext(DataEditScopeContext)
    const changeHandler = (e : React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        console.log(e.target.value)
        setTxt(e.target.value)
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
const MemoBox = React.memo(Box)

function App() {
    const [ state, setState ] = useState<boolean>(false)
    const [ txt, setTxt ] = useState('')

    return <MyScope>
        <DataScopeContext.Provider value = { txt }>
            <DataEditScopeContext.Provider value = { setTxt } >
                <div style={ {border:'1px solid purple', padding:'10px', height: '100px'} }>
                    { state &&
                        // <KeepAlive id = '1'>
                            <MemoBox txt = { txt } />
                        // </KeepAlive>
                    }
                </div>
                <div style={ {border:'1px solid purple', padding:'10px', height: '100px'} }>
                    { !state &&
                        // <KeepAlive id = '1'>
                            <MemoBox txt = { txt } />
                        // </KeepAlive>
                    }
                </div>
            </DataEditScopeContext.Provider>
        </DataScopeContext.Provider>
        <button onClick = { () => {setState(!state)} }>Toggle</button>

        <br />
        <textarea
            value = { txt }
            onChange = { (e : React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                setTxt(e.target.value)
            }
         }
        />
    </MyScope>
}

export default App;
