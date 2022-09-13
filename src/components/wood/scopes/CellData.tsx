import React, { createContext, useContext, useState, useReducer, Reducer, PropsWithChildren } from 'react';
// import { ScopeFromState, ScopeFromReducer } from './helpers'

import { Cell, CellType, CellData } from '#/components/wood/cell/types'

export type { CellData }
const cellDataDefault : CellData = {}

type CellDataAction = {
    type: 'create' // id should be specified??
    cell: Cell
} | {
    type: 'update'
    id: string
    [key: string]: unknown
} | {
    type: 'remove'
    id: string
}

const reducer : Reducer<CellData, CellDataAction> = (prevData, action) => {
    switch(action.type){
    case 'create':
        const { cell } = action
        const newId = cell.id
        return {
            ...prevData,
            [newId]: cell
        }
    case 'update':
        const { type, id, ...fields } = action
        return {
            ...prevData,
            [action.id]: {
                ...prevData[action.id],
                ...fields // as any?
            }
        }
    case 'remove':
        const { [action.id]: unused, ...data } = prevData
        return data
    }
}

const CellDataContext = createContext({
    cellData: cellDataDefault,
    dispatchCellData: (_: CellDataAction) => {}
})

type CellDataScopeProps = PropsWithChildren<{ init?: CellData }>

export function CellDataScope({ init, children }: CellDataScopeProps){
    const [cellData, dispatchCellData] = useReducer(reducer, init || cellDataDefault)

    return (
        <CellDataContext.Provider value={ {cellData, dispatchCellData} }>
            { children }
        </CellDataContext.Provider>
    )
}

export const useCellDataScope = () => useContext(CellDataContext)
