import { StateCreator } from 'zustand'

import { Cell, CellType, cellTypeStr, defaultFields, CellData, isParentType } from '#/components/wood/cell/types'
import { StructData } from '#/components/wood/types'

import { CellDataSlice, createCellDataSlice } from './CellData'
import { StructDataSlice, createStructDataSlice } from './StructData'
import { RenderDataSlice, createRenderDataSlice, RenderData } from './RenderData'

function generateId(ids: string[]) : string{
    let mx = Math.max.apply(
        null,
        ids.map( str => parseInt(str.slice(1)) )
            .filter( isFinite )
            .concat(0)
    ) + 1;
    return 'c' + mx; // cell ids are 'cNN' format now.
}

export type WoodDataSlice = CellDataSlice & StructDataSlice & RenderDataSlice

export interface WoodSlice extends WoodDataSlice{
    readonly woodAction: {
        init(cellData?: CellData, rootId?: string, structData?: StructData): void
        update(id: string, fields: {[key: string]: unknown}): void
        changeType(id: string, cellType: CellType): void
        move(id: string, destParentId: string, destPos?: number): void
        createChild(cellType: CellType, parentId: string, pos?: number): void
        remove(id: string): void

        //aliases
        updateRenderData(): void // => state.renderDataAction.updateFromRoot()
        toggleHideChildren(id: string): void // => state.cellDataAction.toggleHideChildren(id)
    }
}

export const createWoodSlice : StateCreator<
    any, [], [], WoodSlice
> = (set, get, api) => ({
    ...createCellDataSlice(set, get, api),
    ...createStructDataSlice(set, get, api),
    ...createRenderDataSlice(set, get, api),
    woodAction: {
        init(cellData?, rootId?, structData?) {
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

            const prev : WoodSlice = get()
            prev.cellDataAction.init(cellData)
            prev.structDataAction.init(rootId, structData)
            prev.renderDataAction.init(cellData, rootId, structData)
        },
        update(id, fields){
            const prev : WoodSlice = get()
            prev.cellDataAction.update(id, fields)
        },
        changeType(id, cellType){
            if(cellType === 'root' ) return

            const prev : WoodSlice = get()
            if(prev.cellData[id]?.cellType === 'root') return
            
            prev.cellDataAction.create(id, {
                [cellTypeStr]: cellType,
                id,
                ...defaultFields[cellType]
            } as Cell)
            prev.structDataAction.cascadeChildren(id) // redundant since we don't call changeType from parent cells...?
            prev.renderDataAction.relabel()
        },
        move(id, destParentId, destPos?) {
            const prev : WoodSlice = get()

            prev.structDataAction.move(id, destParentId, destPos)
            prev.renderDataAction.relabel()
        },
        createChild(cellType, parentId, pos?) {
            const prev : WoodSlice = get()

            const id = generateId(Object.keys(prev.parentIds))
            prev.cellDataAction.create(id, {
                [cellTypeStr]: cellType,
                id,
                ...defaultFields[cellType]
            } as Cell)
            prev.structDataAction.addChild(id, parentId, pos)
            prev.renderDataAction.relabel()
        },
        remove(id) {
            const prev : WoodSlice = get()

            prev.cellDataAction.remove(id)
            prev.structDataAction.remove(id)
            prev.renderDataAction.relabel()
        },
        updateRenderData() {
            const prev : WoodSlice = get()

            prev.renderDataAction.updateFromRoot()
        },
        toggleHideChildren(id) {
            const prev : WoodSlice = get()

            prev.cellDataAction.toggleHideChildren(id)
        },
    }
})

export type { CellData, StructData, RenderData }