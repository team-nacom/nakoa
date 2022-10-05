import React, { createContext, useContext, useReducer, PropsWithChildren, Reducer } from 'react';
// import { ScopeFromState, ScopeFromReducer } from './helpers'

export interface RenderData{
    mathMacroObj: Object
    Label: Record<string, number[]>
    LabelTypewise: Record<string, number[]>

    // whether hide some children or not

    // render mode(publish / display / preview) : pass as props.
}
export const renderDataDefault : RenderData = {
    mathMacroObj: {},
    Label: {},
    LabelTypewise: {}
}

export type RenderDataAction = {
    type: 'simple'
    next: RenderData
}

/**
 * Reducer for render data.
 * not yet implemented. @todo
 */
export const renderReducer : Reducer<RenderData, RenderDataAction | RenderDataAction[]> = (prev, action) => {
    if(Array.isArray(action)){
        return action.reduce((renderData: RenderData, a)=> renderReducer(renderData, a), prev )
    }

    return action.next;
}

// export const RenderDataContext = createContext(renderDataDefault)

// export const RenderDispatchContext = createContext((_: RenderDataAction | RenderDataAction[]) => {})

// export const useRenderReducer = (init?: RenderData) => useReducer(renderReducer, init || renderDataDefault)

// type RenderDataScopeProps = PropsWithChildren<{ init?: RenderData }>
// export function RenderDataScope({ init, children }: RenderDataScopeProps){
//     const [renderData, renderDispatch] = useRenderReducer(init)

//     return (
//         <RenderDataContext.Provider value={ renderData }>
//             <RenderDispatchContext.Provider value={ renderDispatch }>
//                 { children }
//             </RenderDispatchContext.Provider>
//         </RenderDataContext.Provider>
//     )
// }



// export const useRenderData = () => useContext(RenderDataContext)
// export const useRenderDispatch = () => useContext(RenderDispatchContext)