import {
    Reducer, Dispatch, SetStateAction, useReducer,
    // createContext, useContext,
} from 'react'
import {
    createContext, useContextSelector, useContext
} from 'use-context-selector'

import { CellType, cellTypeStr, defaultFields } from '#/components/wood/cell/types'

import { CellData, cellDataDefault, CellDataAction, cellReducer } from './CellData'
import { StructData, structDataDefault, StructDataAction, structReducer } from './StructData'
import { RenderData, renderDataDefault, RenderDataAction, renderReducer } from './RenderData'
import { EditorState, editorStateDefault } from './EditorState'

export type CombinedState = {
    cellData: CellData,
    structData: StructData,
    renderData: RenderData,
    editorState: EditorState
}

const combinedStateDefault : CombinedState = {
    cellData: cellDataDefault,
    structData: structDataDefault,
    renderData: renderDataDefault,
    editorState: editorStateDefault
}

export type CombinedAction
    = { type: 'update', id: string, [key: string]: unknown }
    | { type: 'changeType', id: string, cellType: CellType }
    | { type: 'move', targetId: string, destParentId: string, destPos?: number } // *
    | { type: 'createChild', parentId: string, cellType: CellType, pos?: number }
    | { type: 'remove', targetId: string } // *

    // | { type: 'toggleHide', id: string }
    // | { type: 'updateMacro', mathMacroObj: Object }

    // | { type: 'focus', id?: string }
    // | { type: 'focusAdj', direction: number }
;

function generateId(parentIds: {[id: string]: string | undefined}) : string{
    let mx = Math.max.apply(
        null,
        Object.keys(parentIds)
            .map( str => parseInt(str.slice(1)) )
            .filter( isFinite )
            .concat(0)
    ) + 1;
    return 'c' + mx; // cell ids are 'cNN' format now.
}

const reducer: Reducer<CombinedState, CombinedAction> = (prev: CombinedState, a: CombinedAction) => {
    const next : CombinedState = {...prev}
    switch(a.type){
    case 'update':{
        const {type, id, ...fields} = a
        next.cellData = cellReducer(prev.cellData, {
            type: 'update',
            id: a.id,
            ...fields
        })
    } break
    case 'changeType': {
        // if(a.cellType === 'root') return;
        next.cellData = cellReducer(prev.cellData, {
            type: 'create',
            id: a.id,
            cell: {
                [cellTypeStr]: a.cellType,
                id: a.id,
                ...defaultFields[a.cellType]
            }
        })
        next.structData = structReducer(prev.structData, {
            type: 'cascadeChildren',
            id: a.id
        })
    } break
    case 'move': {
        const { parentIds } = prev.editorState
        const targetParentId = parentIds[a.targetId]
        if(targetParentId === undefined) return prev

        const targetPos = parentIds[targetParentId]?.indexOf(a.targetId)
        if(targetPos === undefined || targetPos === -1) return prev

        next.structData = structReducer(prev.structData, {
            type: 'moveChild',
            targetParentId,
            targetPos,
            destParentId: a.destParentId,
            destPos: a.destPos
        })
        next.editorState = (({parentIds, ...other} : EditorState)=>{
            const nextParentIds = {...parentIds}
            nextParentIds[a.targetId] = a.destParentId
            return { parentIds, ...other }
        })(prev.editorState)
    } break
    case 'createChild': {
        const newId = generateId(prev.editorState.parentIds)

        next.cellData = cellReducer(prev.cellData, {
            type: 'create',
            id: newId,
            cell: {
                [cellTypeStr]: a.cellType,
                id: newId,
                ...defaultFields[a.cellType]
            }
        })
        next.structData = structReducer(prev.structData, {
            type: 'addChild',
            parentId: a.parentId,
            pos: a.pos,
            cellId: newId
        })
        next.editorState = (({parentIds, ...other} : EditorState)=>{
            const nextParentIds = {...parentIds}
            nextParentIds[newId] = a.parentId
            return { parentIds: nextParentIds, ...other }
        })(prev.editorState)
    } break
    case 'remove': {
        const { parentIds } = prev.editorState
        const targetParentId = parentIds[a.targetId]
        if(targetParentId === undefined) return prev

        const targetPos = parentIds[targetParentId]?.indexOf(a.targetId)
        if(targetPos === undefined || targetPos === -1) return prev

        next.cellData = cellReducer(prev.cellData, {
            type: 'remove',
            id: a.targetId
        })
        next.structData = structReducer(prev.structData, {
            type: 'removeChild',
            parentId: targetParentId,
            pos: targetPos
        })
        next.editorState = (({parentIds, ...other} : EditorState)=>{
            const nextParentIds = {...parentIds}
            delete nextParentIds[a.targetId]
            return { parentIds, ...other }
        })(prev.editorState)
    } break
    }
    return next
}

export const CombinedStateContext = createContext(combinedStateDefault)
export const CombinedDispatchContext = createContext((_: CombinedAction) => {})

export const useCombinedReducer = (init: CombinedState) => useReducer(reducer, init || combinedStateDefault)

export const useCellData = () => useContextSelector(CombinedStateContext, ctx => ctx.cellData)
export const useStructData = () => useContextSelector(CombinedStateContext, ctx => ctx.structData)
export const useRenderData = () => useContextSelector(CombinedStateContext, ctx => ctx.renderData)
export const useEditorState = () => useContextSelector(CombinedStateContext, ctx => ctx.editorState)
export const useCombinedDispatch = () => useContext(CombinedDispatchContext)

export type {
    StructData,
    CellData,
    RenderData,
    EditorState
}