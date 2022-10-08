import React, { createContext, useContext, useReducer, PropsWithChildren, Reducer } from 'react';
import { Cell } from '#/components/wood/cell';
// import { ScopeFromState, ScopeFromReducer } from './helpers'

import katex from 'katex'
import { CellData } from './CellData';
import { StructData } from './StructData';

export interface RenderData{
    mathMacroObj: Object
    Label: Record<string, number[]>
    LabelTypewise: Record<string, number[]>

    // whether hide some children or not
    hideChildren: Record<string, boolean>

    // render mode(publish / display / preview) : pass as props.
}
export const renderDataDefault : RenderData = {
    mathMacroObj: {},
    Label: {},
    LabelTypewise: {},
    hideChildren: {}
}

export type RenderDataAction = {
    type: 'updateFromRoot'
    rootCell: Cell<'root'>
} | {
    type: 'toggleHideChildren'
    id: string
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
    case 'toggleHideChildren': {
        next.hideChildren = {
            ...prev.hideChildren,
            [a.id]: !prev.hideChildren[a.id]
        }
    }

    }

    return next;
}

export function initializeRenderData(cellData: CellData, rootId: string): RenderData{
    const hideChildren: Record<string, boolean> = {}
    for(let id in cellData){
        const cell = cellData[id]
        if(cell.cellType === 'section' && cell.hideChildren){
            hideChildren[id] = true
        }
    }

    const rootCell = cellData[rootId] as Cell<'root'>

    return {
        mathMacroObj: toMathMacroObj(rootCell.mathMacroStr),
        Label: {},
        LabelTypewise: {},
        hideChildren
    }
}