import { Cell, CellType, cellTypeStr, isParentType } from '#/components/wood/cell/types'

import create, { StateCreator } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import isEqual from 'react-fast-compare'

import {
    CellData, StructData, RenderData,
    WoodSlice as WoodActionSlice, WoodDataSlice, createWoodSlice
} from './slice/WoodSlice'

export interface EditorSlice{
    focusId?: string
    hideChildren: Record<string, boolean>
    readonly editorAction: {
        init(cellData?: CellData, rootId?: string, structData?: StructData, focusId?: string): void,
        focus(id?: string): void //focus() : blur
        toggleHideChildren(id: string): void
    }
}

export type EditorState = WoodDataSlice & WoodActionSlice & EditorSlice

export const createEditorState : StateCreator<
    any, [], [], EditorSlice
> = (set, get, api) => ({
    ...createWoodSlice(set, get, api), // manually extend WoodSlice creator

    focusId: undefined,
    hideChildren: {},
    editorAction: {
        init(cellData?, rootId?, structData?, focusId?){
            if(!rootId) rootId = 'c0'
            if(!cellData) cellData = {
                [rootId]: {
                    [cellTypeStr]: 'root',
                    id: rootId,
                    // title: '', author: '',
                    mathMacroStr: ''
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
            
            const prev : EditorState = get()
            prev.woodAction.init(cellData, rootId, structData)

            set((state: EditorState) => {
                state.focusId = focusId

                state.hideChildren = {}
                for(let id in cellData){
                    const cell = cellData[id]
                    if(cell.cellType === 'section' && cell.hideChildren){
                        state.hideChildren[id] = true
                    }
                }

            })
        },
        focus(id?){
            set((state: EditorState) => {
                state.focusId = id
            })
        },
        toggleHideChildren(id) {
            const prev : EditorState = get()
            prev.cellDataAction.toggleHideChildren(id)

            set((state: EditorState) => {
                state.hideChildren[id] = !state.hideChildren[id]
            })
        },
    }
})

export const useEditorState = create<EditorState>()(immer(createEditorState))

export const useEditorInit = () => useEditorState(
    state => (initCellData?: CellData, initRootId?: string, initStructData?: StructData) => {
        state.woodAction.init(initCellData, initRootId, initStructData);
        state.editorAction.init(initCellData, initRootId, initStructData);
    }
)

export const useWoodAction = () => useEditorState(state => state.woodAction)
export const useEditorAction = () => useEditorState(state => state.editorAction)

export const useCellData = () => useEditorState(state => state.cellData)
export const useRootId = () => useEditorState(state => state.rootId)
export const useParentIds = () => useEditorState(state => state.parentIds)
export const useStructData = () => useEditorState(state => state.structData)
export const useRenderData = () => useEditorState(state => state.renderData)

export const useSingleCell = (id: string) => useEditorState(state => state.cellData[id])
export const useSingleCellType = (id: string) => useEditorState(state => state.cellData[id]?.cellType)
export const useSingleCellFocused = (id: string) => useEditorState(state => state.focusId === id)

export const useSingleCellLabel = (id: string) => useEditorState(state => state.renderData.label[id], isEqual)
export const useSingleCellLabelTypewise = (id: string) => useEditorState(state => state.renderData.labelTypewise[id], isEqual)

function getChildren(state: EditorState, id: string): (string[] | undefined){
    const cellType = state.cellData[id]?.cellType
    if(isParentType(cellType)) return state.structData[id] ?? []
    return undefined
}
export const useSingleCellChildren = (id: string) => useEditorState(state => getChildren(state, id))
export const useSingleCellHideChildren = (id: string) => useEditorState(state => state.hideChildren[id])

export type { CellData, StructData, RenderData }