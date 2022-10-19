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

function _generateAllLabel(structData: StructData, id: string, obj: Record<string, number[]>, prefix: number[]){
    obj[id] = prefix;
    (structData[id] || []).forEach((childId,idx)=>{
        _generateAllLabel(structData, childId, obj, [...prefix, idx+1])
    })
}

export function generateAllLabel(structData: StructData, root: string): Record<string, number[]>{
    let obj: Record<string, number[]> = {}
    _generateAllLabel(structData, root, obj, [])
    return obj
}

function _generateTypedLabel(structData: StructData, cellData: CellData, id: string, obj: Record<string, number[]>, prefix: number[]){
    obj[id] = prefix;

    const idxObj : Record<string, number> = {};
    (structData[id] || []).forEach((childId,idx)=>{
        let currentType : string = cellData[idx]?.cellType || 'unknown'
        // may have additional handlings, like...
        // if(cellData[idx].cellType === 'block' && cellData[idx].blockType === 'theorem'){
        //     currentType = 'block-theorem'
        // }

        const currentTypeNextIdx = idxObj[currentType] = (idxObj[currentType] || 0) + 1

        _generateTypedLabel(structData, cellData, childId, obj, [...prefix, currentTypeNextIdx])
    })
}

export function generateTypedLabel(structData: StructData, cellData: CellData, root: string): Record<string, number[]>{
    let obj: Record<string, number[]> = {}
    _generateTypedLabel(structData, cellData, root, obj, [])
    return obj
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

export function initializeRenderData(structData: StructData, cellData: CellData, rootId: string): RenderData{
    const hideChildren: Record<string, boolean> = {}
    for(let id in cellData){
        const cell = cellData[id]
        if(cell.cellType === 'section' && cell.hideChildren){
            hideChildren[id] = true
        }
    }

    const Label = generateAllLabel(structData, rootId)
    const LabelTypewise = generateTypedLabel(structData, cellData, rootId)

    const rootCell = cellData[rootId] as Cell<'root'>

    return {
        mathMacroObj: toMathMacroObj(rootCell.mathMacroStr),
        Label, LabelTypewise,
        hideChildren
    }
}
