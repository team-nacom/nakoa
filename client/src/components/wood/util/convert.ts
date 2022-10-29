// conversion between server-storing data and state (i.e. wood <=> [rootId, cellData, structData] )

import { Cell, CellData } from '#/components/wood/cell/types'
import { StructData, Wood } from '#/components/wood/types'
import { CombinedState, initializeState } from '#/components/wood/states'

export function wood2state(wood: Wood, cellData: CellData): CombinedState{
    // this requires explicit cellData to construct state.
    // todo: fetch cell data from BE server manually.

    if(cellData[wood.rootId]?.cellType !== 'root') return initializeState(wood.rootId)
    return initializeState(wood.rootId, cellData, wood.structData)
}

export function state2wood(state: CombinedState): Wood{
    return {
        rootId: state.rootId,
        title: (state.cellData[state.rootId] as Cell<'root'>).title,
        author: (state.cellData[state.rootId] as Cell<'root'>).author,
        structData: state.structData
    }
}