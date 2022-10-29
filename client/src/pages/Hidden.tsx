import { useMemo } from 'react'

import {
    initializeState,
    
    CombinedStateContext, CombinedDispatchContext,
    useCombinedReducer, useCombinedDispatch,
} from '#/components/wood/states'

import { rootId, cellData, structData } from './pfaffian'

import { EditorCore } from '#/components/wood/editor/Editor'

function Hidden() {
    const initState = useMemo(() => initializeState(rootId, cellData, structData), [])
    const [data, dispatch] = useCombinedReducer(initState)
    return (
        <>
            <div id='content'>
                <CombinedStateContext.Provider value={ data }>
                    <CombinedDispatchContext.Provider value={ dispatch }>
                        <EditorCore />
                    </CombinedDispatchContext.Provider>
                </CombinedStateContext.Provider>
            </div>
        </>
    );
}

export default Hidden;