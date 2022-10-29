import {
    Reducer, Dispatch, SetStateAction, useReducer, useMemo
    // createContext, useContext,
} from 'react'
import {
    Context,
    createContext, useContextSelector, useContext
} from 'use-context-selector'
import isEqual from 'react-fast-compare'

import { Cell, CellBase, CellType, cellTypeStr, defaultFields, isParentType } from '#/components/wood/cell'

import { CellData, cellDataDefault, cellReducer } from './CellData'
import { StructData, structDataDefault, structReducer } from './StructData'
import {
    RenderData, renderDataDefault, renderReducer, initializeRenderData,
    generateAllLabel, generateTypedLabel
} from './RenderData'
import { EditorState, editorStateDefault } from './EditorState'

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

    | { type: 'updateRenderData' }
    | { type: 'toggleHideChildren', id: string }

    | { type: 'focus', targetId?: string } // blur with targetId = undefined
    // | { type: 'focusAdj', direction: number }
;

function generateId(ids: string[]) : string{
    let mx = Math.max.apply(
        null,
        ids.map( str => parseInt(str.slice(1)) )
            .filter( isFinite )
            .concat(0)
    ) + 1;
    return 'c' + mx; // cell ids are 'cNN' format now.
}

const reducer: Reducer<CombinedState, CombinedAction> = (prev: CombinedState, a: CombinedAction) => {
    const next : CombinedState = {...prev}
    switch(a.type){
    case 'update':{
        const {type, id, lastModified, ...fields} = a
        next.cellData = cellReducer(prev.cellData, {
            type: 'update',
            id: a.id,
            lastModified: Date.now(),
            ...fields
        })
    } break
    case 'changeType': {
        if(a.cellType === 'root' || prev.cellData[a.id].cellType === 'root') return prev
        next.cellData = cellReducer(prev.cellData, {
            type: 'create',
            id: a.id,
            cell: {
                [cellTypeStr]: a.cellType,
                ...({
                    id: a.id,
                    author: '',
                    lastModified: Date.now()
                }) as CellBase,
                ...defaultFields[a.cellType]
            } as any
        })
        next.structData = structReducer(prev.structData, {
            type: 'cascadeChildren',
            id: a.id
        })

        next.renderData = renderReducer(prev.renderData, {
            type: 'relabel',
            structData: next.structData,
            cellData: next.cellData,
            rootId: next.rootId
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
        next.renderData = renderReducer(prev.renderData, {
            type: 'relabel',
            structData: next.structData,
            cellData: next.cellData,
            rootId: next.rootId
        })
    } break
    case 'createChild': {
        const { parentIds } = prev
        const newId = generateId(Object.keys(prev.parentIds))

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
        next.renderData = renderReducer(prev.renderData, {
            type: 'relabel',
            structData: next.structData,
            cellData: next.cellData,
            rootId: next.rootId
        })
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

        // recalculate parentIds...
        next.parentIds = { [next.rootId]: undefined }
        for(let pid in next.structData){
            for(let cid of next.structData[pid]){
                next.parentIds[cid] = pid
            }
        }
        // next.parentIds = Object.fromEntries(
        //     Object.entries(next.parentIds).filter( ([id, p]) => (
        //         id in next.structData
        //      ) )
        // )

        next.renderData = renderReducer(prev.renderData, {
            type: 'relabel',
            structData: next.structData,
            cellData: next.cellData,
            rootId: next.rootId
        })
    } break

    case 'updateRenderData': {
        next.renderData = renderReducer(prev.renderData, {
            type: 'updateFromRoot',
            rootCell: prev.cellData[prev.rootId] as Cell<'root'>
        })
    } break
    case 'toggleHideChildren': {
        next.hideChildren = {
            ...prev.hideChildren,
            [a.id]: !prev.hideChildren[a.id]
        }
    } break

    case 'focus': {
        if(prev.focusId === prev.rootId){
            //special treatement: if root cell is blurred, then render data are updated.
            next.renderData = renderReducer(prev.renderData, {
                type: 'updateFromRoot',
                rootCell: prev.cellData[prev.rootId] as Cell<'root'>
            })
        }
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

    const parentIds : {[id: string]: string | undefined} = { [rootId]: undefined }
    for(let pid in structData){
        for(let cid of structData[pid]){
            parentIds[cid] = pid
        }
    }

    const hideChildren: Record<string, boolean> = {}
    for(let id in cellData){
        const cell = cellData[id]
        if(cell.cellType === 'section' && cell.hideChildren){
            hideChildren[id] = true
        }
    }

    return {
        cellData, structData,
        renderData: initializeRenderData(structData, cellData, rootId),
        parentIds, rootId,
        focusId,
        hideChildren
    }
}

// https://github.com/dai-shi/use-context-selector/issues/19#issuecomment-927748302
export const useContextSelectorDeep = <T extends any, R extends any>(
    context: Context<T>,
    selector: (val: T) => R,
) => {
    const patchedSelector = useMemo(() => {
        let prevValue: R | null = null;
    
        return (state: T) => {
            const nextValue: R = selector(state);
            if (prevValue !== null && isEqual(prevValue, nextValue)) {
                return prevValue;
            }
    
            prevValue = nextValue;
            return nextValue;
        };
    }, [selector]);
  
    return useContextSelector(context, patchedSelector);
};

export const CombinedStateContext = createContext(combinedStateDefault)
export const CombinedDispatchContext = createContext((_: CombinedAction) => {})

export const useCombinedReducer = (init: CombinedState) => useReducer(reducer, init ?? combinedStateDefault)

export const useRootId = () => useContextSelector(CombinedStateContext, ctx => ctx.rootId)
export const useParentIds = () => useContextSelector(CombinedStateContext, ctx => ctx.parentIds)
export const useMetaData = () => useContextSelector(CombinedStateContext, ctx => ctx.cellData[ctx.rootId] as Cell<'root'>)

export const useSingleCell = (id: string) => useContextSelector(CombinedStateContext, ctx => ctx.cellData[id])
export const useSingleCellType = (id: string) => useContextSelector(CombinedStateContext, ctx => ctx.cellData[id]?.cellType)
export const useSingleCellFocused = (id: string) => useContextSelector(CombinedStateContext, ctx => ctx.focusId === id)

export const useSingleCellLabel = (id: string) => useContextSelectorDeep(CombinedStateContext, ctx => ctx.renderData.Label[id] ?? [])
export const useSingleCellLabelTypewise = (id: string) => useContextSelectorDeep(CombinedStateContext, ctx => ctx.renderData.LabelTypewise[id] ?? [])

function getChildren(state: CombinedState, id: string): (string[] | undefined){
    const cellType = state.cellData[id]?.cellType
    if(isParentType(cellType)) return state.structData[id] ?? []
    return undefined
}
export const useSingleCellChildren = (id: string) => useContextSelector(CombinedStateContext, ctx => getChildren(ctx, id) )
export const useSingleCellHideChildren = (id: string) => useContextSelector(CombinedStateContext, ctx => ctx.hideChildren[id])

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