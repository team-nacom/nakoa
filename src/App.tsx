import React, { useState, useCallback } from 'react'

import {
    cellTypeStr, 
} from '#/components/wood/cell'

import {
    CellData,
    
    CombinedStateContext, CombinedDispatchContext,
    useCombinedReducer, useCombinedDispatch
} from '#/components/wood/states'

import { EditorCore } from '#/components/wood/editor/Editor'

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

function App() {
    const parentIds : {[id: string]: string | undefined} = {}
    for(let pid in struct0){
        for(let cid of struct0[pid]){
            parentIds[cid] = pid;
        }
    }

    const [data, dispatch] = useCombinedReducer({
        cellData: data0,
        structData: struct0,
        renderData: { mathMacro: {}, Label: {}, LabelTypewise: {} },
        parentIds,
        focusId: rootId,
        rootId
    })

    return (
        <div id='content'>
            <CombinedStateContext.Provider value={ data }>
                <CombinedDispatchContext.Provider value={ dispatch }>
                    <EditorCore />
                </CombinedDispatchContext.Provider>
            </CombinedStateContext.Provider>
        </div>
    );
}

export default App;