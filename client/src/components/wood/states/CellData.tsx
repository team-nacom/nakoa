import React, { createContext, useContext, useState, useReducer, Reducer, PropsWithChildren } from 'react';
// import { ScopeFromState, ScopeFromReducer } from './helpers'

import { Cell, CellType, CellData } from '#/components/wood/cell/types'

export const cellDataDefault : CellData = {}

export type CellDataAction = {
    type: 'create' // create/replace
    id: string
    cell: Cell
} | {
    type: 'update'
    id: string
    [key: string]: unknown
} | {
    type: 'remove'
    id: string
}

export const cellReducer : Reducer<CellData, CellDataAction | CellDataAction[]> = (prevData, action) => {
    if(Array.isArray(action)){
        return action.reduce((data: CellData, a)=> cellReducer(data, a), prevData )
    }

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

export type { CellData }

// export const CellDataContext = createContext(cellDataDefault)
// export const CellDispatchContext = createContext((_: CellDataAction) => {})

// export const useCellReducer = (init?: CellData) => useReducer(cellReducer, init ?? cellDataDefault)

// type CellDataScopeProps = PropsWithChildren<{ init?: CellData }>
// export function CellDataScope({ init, children }: CellDataScopeProps){
//     const [cellData, cellDispatch] = useCellReducer(init)

//     return (
//         <CellDataContext.Provider value={ cellData }>
//             <CellDispatchContext.Provider value={ cellDispatch }>
//                 { children }
//             </CellDispatchContext.Provider>
//         </CellDataContext.Provider>
//     )
// }

// export const useCellData = () => useContext(CellDataContext)
// export const useCellDispatch = () => useContext(CellDispatchContext)