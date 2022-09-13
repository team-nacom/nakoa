import React, { createContext, useContext, useReducer, PropsWithChildren, Reducer } from 'react';
// import { ScopeFromState, ScopeFromReducer } from './helpers'

export interface RenderInfo{
    mathMacro: Object
    Label: Record<string, number[]>
    LabelTypewise: Record<string, number[]>

    // whether hide some children or not

    // render mode(publish / display / preview) : pass as props.
}
const renderInfoDefault : RenderInfo = {
    mathMacro: {},
    Label: {},
    LabelTypewise: {}
}

type RenderInfoAction = {
    type: 'simple'
    next: RenderInfo
}

/**
 * Reducer for render info.
 * not yet implemented. @todo
 */
const reducer : Reducer<RenderInfo, RenderInfoAction> = (prev, action) => {
    return action.next;
}

const RenderInfoContext = createContext({
    renderInfo: renderInfoDefault,
    dispatchRenderInfo: (_: RenderInfoAction) => {}
})

type RenderInfoScopeProps = PropsWithChildren<{ init?: RenderInfo }>

export function RenderInfoScope({ init, children }: RenderInfoScopeProps){
    const [renderInfo, dispatchRenderInfo] = useReducer(reducer, init || renderInfoDefault)

    return (
        <RenderInfoContext.Provider value={ {renderInfo, dispatchRenderInfo} }>
            { children }
        </RenderInfoContext.Provider>
    )
}

export const useRenderInfoScope = () => useContext(RenderInfoContext)
