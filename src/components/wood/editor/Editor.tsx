import { useState, useReducer, useCallback, useEffect, useMemo } from 'react'

import {
    CellData,
    useCellData, useStructData, useRenderData, useEditorState,
    
    CombinedStateContext, CombinedDispatchContext,
    useCombinedReducer, useCombinedDispatch
} from '#/components/wood/states'



import {
    MemoizedCellRenderer, cellTypeStr, CellIndicatorProps,
    RenderMode
} from '#/components/wood/cell'

import {
    CellPortalScope,
    CellPortalWithInterCell, InterCellProps
} from './CellPortal'

const rootId = 'c0'

const struct0 : { [id: string]: string[] } = {
    [rootId]: ['c1', 'c2', 'c3'],
    'c1': [],
    'c2': [],
    'c3': []
}

const data0 : CellData = {
    [rootId]: {
        [cellTypeStr]: 'text',
        id: rootId,
        value: ''
    },
    'c1': {
        [cellTypeStr]: 'code',
        id: 'c1',
        value: 'print(\'Hello, World!\')'
    },
    'c2': {
        [cellTypeStr]: 'math',
        id: 'c2',
        value: 'a^2+b^2=c^2'
    },
    'c3': {
        [cellTypeStr]: 'text',
        id: 'c3',
        value: 'wwwwww'
    }
}

function InterCell({ parentId, idx }: InterCellProps){
    const dispatch = useCombinedDispatch()
    return (
        <button onClick={(ev)=>{
            ev.stopPropagation()
            dispatch({
                type: 'createChild',
                parentId,
                pos: idx,
                cellType: 'text'
            })
        }}>
            Add children
        </button>
    )
}

const CellPortal = CellPortalWithInterCell(InterCell)

export function Editor(){
    // calculating parentIds from childrenIds(struct) --
    // childrenIds should be managed by structData / editorState is some cache of it, stored in editorState.
    const parentIds : {[id: string]: string | undefined} = {}
    for(let pid in struct0){
        for(let cid of struct0[pid]){
            parentIds[cid] = pid;
        }
    }

    // todo : make rootId, struct0, data0 into props.
    const [data, dispatch] = useCombinedReducer({
        cellData: data0,
        structData: struct0,
        renderData: { mathMacro: {}, Label: {}, LabelTypewise: {} },
        editorState: { parentIds }
    })

    return (
        <CombinedStateContext.Provider value={ data }>
            <CombinedDispatchContext.Provider value={ dispatch }>
                <CellPortalScope
                    CellIndicator={ MemoizedCellRenderer }
                >
                    <CellPortal id= { rootId } />
                </CellPortalScope>
            </CombinedDispatchContext.Provider>
        </CombinedStateContext.Provider>
    )
}