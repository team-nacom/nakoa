// copied from https://medium.com/@adithyaviswam/an-unusual-use-case-of-react-portals-caching-components-3217e70b66b4
// https://codesandbox.io/s/react-portal-keep-alive-ingxb?runonclick=1&file=/src/Providers/AliveScope.js

import React, { useContext, createContext, useState, ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface NodeState{
    [id: string]: {
        children: React.ReactNode,
        element: HTMLDivElement
    }
}

const AliveScopeContext = createContext({
    getPortalElement: (id: string, children: ReactNode)=>(document.createElement('div')),
    removePortalElement: (id: string)=>{} // dummy default value.
});
type AliveScopeProps = React.PropsWithChildren<{}>;

export function AliveScope({ children }: AliveScopeProps){
    const [nodes, setNodes] = useState<NodeState>({});
    
    function getPortalElement(id: string, children: ReactNode){
        // console.log(nodes)
        // console.log(nodes[id]?.element)
        if(!nodes[id]){
            const element = document.createElement('div');
            element.id = `alive-${ id }`
            setNodes((prevNodes) => ({
                ...prevNodes,
                [id]: { children, element }
            }));
            return element;
        }
        return nodes[id].element;
    }

    function removePortalElement(id: string){
        setNodes((prevNodes)=>{
            const { [id]: unused, ...nodes } = prevNodes;
            return nodes;
        })
    }

    return (
        <AliveScopeContext.Provider
          value={{
            getPortalElement,
            removePortalElement
          }}
        >
            { children }
            {Object.entries(nodes).map(([id, { children: c, element: el }]) => (
                <React.Fragment key={id}>
                    { ReactDOM.createPortal(c, el) }
                </React.Fragment>
            ))}
        </AliveScopeContext.Provider>
    );

}

export const useAliveScope = () => useContext(AliveScopeContext);



