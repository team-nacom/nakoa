import React, { createContext, useContext, useState, PropsWithChildren  } from 'react';
// import { ScopeFromState, ScopeFromReducer } from './helpers'

export interface WoodStruct{
    rootId: string
    childIds: {
        [id: string]: string[]
    }
}

const woodStructDefault : WoodStruct = { rootId: 'c0', childIds: { 'c0': [] } }

// @todo reimplement this as non-repeating logic
//
// export const [ WoodStructScope, useWoodStruct ] = ScopeFromState('woodStruct', 'setWoodStruct', woodStructDefault)

const WoodStructContext = createContext({
    woodStruct: woodStructDefault,
    setWoodStruct: (_: WoodStruct) => {}
})

type WoodStructScopeProps = PropsWithChildren<{ init?: WoodStruct }>

export function WoodStructScope({ init, children }: WoodStructScopeProps){
    const [woodStruct, setWoodStruct] = useState(init || woodStructDefault)

    return (
        <WoodStructContext.Provider value={ {woodStruct, setWoodStruct} }>
            { children }
        </WoodStructContext.Provider>
    )
}

export const useWoodStructScope = () => useContext(WoodStructContext)
