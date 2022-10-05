import React, { useState, useCallback } from 'react'

import {
    cellTypeStr, 
} from '#/components/wood/cell'

import {
    initializeState,
    
    CombinedStateContext, CombinedDispatchContext,
    useCombinedReducer, useCombinedDispatch
} from '#/components/wood/states'

import { EditorCore } from '#/components/wood/editor/Editor'

const rootId = 'c0'

function App() {
    const [data, dispatch] = useCombinedReducer(initializeState(rootId))
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