// copied from https://medium.com/@adithyaviswam/an-unusual-use-case-of-react-portals-caching-components-3217e70b66b4
// https://codesandbox.io/s/react-portal-keep-alive-ingxb?runonclick=1&file=/src/Providers/AliveScope.js

import React, { useContext, createContext, useState, ReactNode } from 'react';
import ReactDOM from 'react-dom';

import { KeepAliveKeyType } from './types'

interface NodeState{
    [id: KeepAliveKeyType]: {
        children: React.ReactNode,
        element: HTMLDivElement
    }
}

const AliveScopeContext = createContext({
    getPortalElement: (id: KeepAliveKeyType, children: ReactNode)=>(document.createElement('div')) // dummy default value.
});
type AliveScopeProps = React.PropsWithChildren<{}>;

export function AliveScope({ children }: AliveScopeProps){
    const [nodes, setNodes] = useState<NodeState>({});
    
    function getPortalElement(id: KeepAliveKeyType, children: ReactNode){
        if(!nodes[id]){
            const element = document.createElement('div');
            setNodes((prevNodes) => ({
                ...prevNodes,
                [id]: { children, element }
            }));
            return element;
        }
        return nodes[id].element;
    }

    return (
        <AliveScopeContext.Provider
          value={{
            getPortalElement
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



