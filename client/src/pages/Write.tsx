import { useEffect, useState, useMemo, useCallback } from 'react'

import {
    CellData, StructData, RenderData,

    useEditorInit as useCellEditorInit, useRootId, useCellData, useStructData
} from '#/components/wood/store/EditorState'

import {
    useClassicEditorInit
} from '#/components/classic-editor/EditorState'

import { Editor } from '#/components/editor/Editor'

import Header from '#/components/Header'
import Footer from '#/components/Footer'

import { autoSaveIntervalMs, localStorageKeys } from '#/misc/consts'

function Write() {
    const cellInit = useCellEditorInit()
    const classicInit = useClassicEditorInit()
    useEffect(() => {
        cellInit()
        classicInit('')
    }, [])


    // // initializing state
    // // TODO: updating
    // const [initCellData, initRootId, initStructData] : [CellData?, string?, StructData?] = useMemo(() => {
    //     // find if draft has been autosaved in local storage.
    //     // @todo: make the state persist (in zustand meaning)
    //     const storedCellDataStr = localStorage.getItem(localStorageKeys.cellDataDraft)
    //     const storedRootId = localStorage.getItem(localStorageKeys.rootIdDraft)
    //     const storedStructDataStr = localStorage.getItem(localStorageKeys.structDataDraft)
    //     if( storedCellDataStr && storedRootId && storedStructDataStr ){
    //         return [
    //             JSON.parse(storedCellDataStr) ?? {},
    //             storedRootId,
    //             JSON.parse(storedStructDataStr) ?? { [storedRootId]: [] }
    //         ]
    //     }

    //     // draft not found.
    //     return [undefined, 'c0', undefined]
    // }, [])

    // // initialize editor state.
    // const init = useEditorInit()
    // useEffect(() => {
    //     init(initCellData, initRootId, initStructData)
    // }, [])

    // // subscribe for state variables.
    // const [cellData, rootId, structData] = [useCellData(), useRootId(), useStructData()]

    // const [autoSaveFlag, setAutoSaveFlag] = useState(0)
    // useEffect(() => {
    //     if (autoSaveFlag === 0) setAutoSaveFlag(1)
    // }, [autoSaveFlag, cellData, rootId, structData])
    // useEffect(() => {
    //     if (autoSaveFlag === 1){
    //         setAutoSaveFlag(-1);
    //         setTimeout(() => {
    //             // save draft in localStorage.
    //             localStorage.setItem(localStorageKeys.cellDataDraft, JSON.stringify(cellData));
    //             localStorage.setItem(localStorageKeys.rootIdDraft, rootId);
    //             localStorage.setItem(localStorageKeys.structDataDraft, JSON.stringify(structData));
    //             console.log('Autosaved');
    //             setAutoSaveFlag(0);
    //         }, autoSaveIntervalMs)
    //     }
    // }, [autoSaveFlag, cellData, rootId, structData]) // BUG: autosave state is fixed to the version when autosave flag is set to 1. (any changes between flag set ~ autosave is discarded)

    // const upload = useCallback(()=>{
    //     console.log(cellData, structData)
    // }, [cellData, structData])

    // // TODO: loading from autosave??

    return <Editor />;
}

export default Write;