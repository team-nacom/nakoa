import {
    Reducer, Dispatch, SetStateAction, useReducer,
    // createContext, useContext,
} from 'react'
import {
    createContext, useContextSelector, useContext
} from 'use-context-selector'

import { Cell, CellType, cellTypeStr, defaultFields } from '#/components/wood/cell/types'

import { CellData, cellDataDefault, cellReducer } from './CellData'
import { StructData, structDataDefault, structReducer } from './StructData'
import { RenderData, renderDataDefault, renderReducer } from './RenderData'
import { EditorState, editorStateDefault } from './EditorState'

import katex from 'katex'

// define combined state, combined action to manage data and states simultaneously

export interface CombinedState extends EditorState {
    cellData: CellData,
    structData: StructData,
    renderData: RenderData,
}

const combinedStateDefault : CombinedState = {
    ...editorStateDefault,
    cellData: cellDataDefault,
    structData: structDataDefault,
    renderData: renderDataDefault,
}

export type CombinedAction
    = { type: 'update', id: string, [key: string]: unknown }
    | { type: 'changeType', id: string, cellType: CellType }
    | { type: 'move', targetId: string, destParentId: string, destPos?: number } // *
    | { type: 'createChild', parentId: string, cellType: CellType, pos?: number }
    | { type: 'remove', targetId: string } // *

    // | { type: 'toggleHide', id: string }
    // | { type: 'updateMacro', mathMacroObj: Object }

    | { type: 'focus', targetId?: string } // blur with targetId = undefined
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

function toMathMacroObj(mathMacroStr: string){
    let obj = {}
    katex.renderToString(mathMacroStr,{
        throwOnError: false,
        globalGroup: true,
        macros: obj
    })
    return obj
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

        if(id === prev.rootId && fields.mathMacroStr){
            const mathMacroStr = fields.mathMacroStr as string
            next.renderData = {
                ...prev.renderData,
                mathMacroObj: toMathMacroObj(mathMacroStr)
            }
        }

    } break
    case 'changeType': {
        if(a.cellType === 'root' || prev.cellData[a.id].cellType === 'root') return prev
        next.cellData = cellReducer(prev.cellData, {
            type: 'create',
            id: a.id,
            cell: {
                [cellTypeStr]: a.cellType,
                id: a.id,
                ...defaultFields[a.cellType]
            } as any
        })
        next.structData = structReducer(prev.structData, {
            type: 'cascadeChildren',
            id: a.id
        })
    } break
    case 'move': {
        const { parentIds, structData } = prev
        const targetParentId = parentIds[a.targetId]
        if(targetParentId === undefined) return prev

        const targetPos = structData[targetParentId]?.indexOf(a.targetId)
        if(targetPos === undefined || targetPos === -1) return prev

        next.structData = structReducer(prev.structData, {
            type: 'moveChild',
            targetParentId,
            targetPos,
            destParentId: a.destParentId,
            destPos: a.destPos
        })
        next.parentIds = {...parentIds, [a.targetId]: a.destParentId }
    } break
    case 'createChild': {
        const { parentIds } = prev
        const newId = generateId(prev.parentIds)

        next.cellData = cellReducer(prev.cellData, {
            type: 'create',
            id: newId,
            cell: {
                [cellTypeStr]: a.cellType,
                id: newId,
                ...defaultFields[a.cellType]
            } as any
        })
        next.structData = structReducer(prev.structData, {
            type: 'addChild',
            parentId: a.parentId,
            pos: a.pos,
            cellId: newId
        })
        next.parentIds = {...parentIds, [newId]: a.parentId }
    } break
    case 'remove': {
        if(prev.cellData[a.targetId].cellType === 'root') return prev
        const { parentIds, structData } = prev
        const targetParentId = parentIds[a.targetId]
        if(targetParentId === undefined) return prev

        const targetPos = structData[targetParentId]?.indexOf(a.targetId)
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

        const { [a.targetId]: unused, ...newParentIds } = parentIds
        next.parentIds = newParentIds
    } break

    case 'focus': {
        next.focusId = a.targetId
    } break

    }
    return next
}

export function initializeState(
    rootId: string,
    cellData?: CellData, structData?: StructData,
    focusId?: string
) : CombinedState{

    if(!cellData){
        cellData = {
            [rootId]: {
                [cellTypeStr]: 'root',
                id: rootId,
                title: '', author: '', mathMacroStr: ''
            }
        }
    }
    if(!structData){
        structData = { [rootId]: [] }
        for(let id in cellData){
            if(id === rootId) continue
            structData[rootId].push(id)
            structData[id] = []
        }
    }

    const parentIds : {[id: string]: string | undefined} = {}
    for(let pid in structData){
        for(let cid of structData[pid]){
            parentIds[cid] = pid;
        }
    }

    const mathMacroStr = (cellData[rootId] as Cell<'root'>).mathMacroStr

    return {
        cellData, structData,
        renderData: {
            mathMacroObj: toMathMacroObj(mathMacroStr),
            Label: {},
            LabelTypewise: {}
        },
        parentIds, rootId, focusId
    }
}

export const CombinedStateContext = createContext(combinedStateDefault)
export const CombinedDispatchContext = createContext((_: CombinedAction) => {})

export const useCombinedReducer = (init: CombinedState) => useReducer(reducer, init || combinedStateDefault)

export const useRootId = () => useContextSelector(CombinedStateContext, ctx => ctx.rootId)
export const useMetaData = () => useContextSelector(CombinedStateContext, ctx => ctx.cellData[ctx.rootId] as Cell<'root'>)

export const useSingleCell = (id: string) => useContextSelector(CombinedStateContext, ctx => ctx.cellData[id])
export const useSingleCellType = (id: string) => useContextSelector(CombinedStateContext, ctx => ctx.cellData[id]?.cellType)
export const useSingleCellFocused = (id: string) => useContextSelector(CombinedStateContext, ctx => ctx.focusId === id)

export const useSingleCellChildren = (id: string) => useContextSelector(CombinedStateContext, ctx => (ctx.structData[id] || []) )

export const useCellData = () => useContextSelector(CombinedStateContext, ctx => ctx.cellData)
export const useStructData = () => useContextSelector(CombinedStateContext, ctx => ctx.structData)
export const useRenderData = () => useContextSelector(CombinedStateContext, ctx => ctx.renderData)
export const useCombinedDispatch = () => useContext(CombinedDispatchContext)

export type {
    StructData,
    CellData,
    RenderData,
    EditorState
}