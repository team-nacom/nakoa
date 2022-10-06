import React, { createContext, useContext, useReducer, PropsWithChildren, Reducer } from 'react';
import { Cell } from '#/components/wood/cell';
// import { ScopeFromState, ScopeFromReducer } from './helpers'

import katex from 'katex'

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
    type: 'updateFromRoot'
    rootCell: Cell<'root'>
}


// helper function
function toMathMacroObj(mathMacroStr: string){
    let obj = {}
    katex.renderToString(mathMacroStr,{
        throwOnError: false,
        globalGroup: true,
        macros: obj
    })
    return obj
}


/**
 * Reducer for render data.
 */
export const renderReducer : Reducer<RenderData, RenderDataAction | RenderDataAction[]> = (prev, a) => {
    if(Array.isArray(a)){
        return a.reduce((renderData: RenderData, a)=> renderReducer(renderData, a), prev )
    }

    const next = {...prev}
    switch(a.type){
    case 'updateFromRoot': {
        next.mathMacroObj = toMathMacroObj(a.rootCell.mathMacroStr)
    } break

    }

    return next;
}

export function initializeRenderData(rootCell: Cell<'root'>): RenderData{
    return {
        mathMacroObj: toMathMacroObj(rootCell.mathMacroStr),
        Label: {},
        LabelTypewise: {}
    }
}