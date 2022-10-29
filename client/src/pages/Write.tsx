import { useEffect, useState, useMemo, useCallback } from 'react'

import {
    initializeState,

    CombinedStateContext, CombinedDispatchContext,
    useCombinedReducer, useCombinedDispatch,
} from '#/components/wood/states'

import { wood2state, state2wood } from '#/components/wood/util/convert'

import { EditorCore } from '#/components/wood/editor/Editor'

import Header from '#/components/Header'
import Footer from '#/components/Footer'

import { autoSaveIntervalMs, localStorageKeys } from '#/misc/consts'

function Write() {
    // initializing state
    // TODO: updating
    const initState = useMemo(() => {
        // find if draft has been autosaved in local storage.
        const storedRootId = localStorage.getItem(localStorageKeys.rootIdDraft)
        const storedCellDataStr = localStorage.getItem(localStorageKeys.cellDataDraft)
        const storedStructDataStr = localStorage.getItem(localStorageKeys.structDataDraft)
        if( storedRootId && storedCellDataStr && storedStructDataStr ){
            return initializeState(
                storedRootId,
                JSON.parse(storedCellDataStr) ?? {},
                JSON.parse(storedStructDataStr) ?? { [storedRootId]: [] }
            )
        }

        // draft not found.
        return initializeState('c0')
    }, [])

    const [state, dispatch] = useCombinedReducer(initState)

    const [autoSaveFlag, setAutoSaveFlag] = useState(0)
    useEffect(() => {
        if (autoSaveFlag == 0) setAutoSaveFlag(1)
    }, [state])
    useEffect(() => {
        if (autoSaveFlag == 1){
            setAutoSaveFlag(-1);
            setTimeout(() => {
                // save draft in localStorage.
                localStorage.setItem(localStorageKeys.rootIdDraft, state.rootId)
                localStorage.setItem(localStorageKeys.cellDataDraft, JSON.stringify(state.cellData));
                localStorage.setItem(localStorageKeys.structDataDraft, JSON.stringify(state.structData));
                console.log('Autosaved');
                setAutoSaveFlag(0);
            }, autoSaveIntervalMs)
        }
    }, [autoSaveFlag]) // BUG: autosave state is fixed to the version when autosave flag is set to 1. (any changes between flag set ~ autosave is discarded)

    const upload = useCallback(()=>{
        console.log(state.cellData, state.structData)
    }, [state])

    // TODO: loading from autosave??

    return (
        <>
            <Header />
            <div id='content'>
                <CombinedStateContext.Provider value={ state }>
                    <CombinedDispatchContext.Provider value={ dispatch }>
                        <EditorCore upload={ upload } />
                    </CombinedDispatchContext.Provider>
                </CombinedStateContext.Provider>
            </div>
            <Footer />
        </>
    );
}

export default Write;