import { StateCreator } from 'zustand'

import { Cell, CellType, cellTypeStr, CellData } from '#/components/wood/cell/types'

export interface CellDataSlice{
    cellData: CellData,
    readonly cellDataAction: {
        init(cellData: CellData): void,
        create(id: string, cell: Cell): void, //create OR replace
        update(id: string, fields: {[key: string]: unknown }): void,
        remove(id: string): void
        toggleHideChildren(id: string): void
    }
}

export const createCellDataSlice : StateCreator<
    any, [], [], CellDataSlice
> = (set, get) => ({
    cellData: {},
    cellDataAction: {
        init(cellData) {
            set((state: CellDataSlice) => {
                state.cellData = cellData
            })
        },
        create(id, cell){
            set((state: CellDataSlice) => {
                state.cellData[id] = cell // use id or cell.id ?
                // ok to directly update state as long as immer is used
            } )
        },
        update(id, fields) {
            set((state: CellDataSlice) => {
                Object.assign(state.cellData[id], fields)
            })
        },
        remove(id) {
            set((state: CellDataSlice) => {
                delete state.cellData[id]
            })
        },
        toggleHideChildren(id) {
            set((state: CellDataSlice) => {
                const cell = state.cellData[id]
                if(cell && cell[cellTypeStr] === 'section'){
                    cell.hideChildren = !cell.hideChildren
                }
                state.cellData[id] = cell //since `cell` is shallow, no need to reassign it... but just for sure...
            })
        },
    }
})