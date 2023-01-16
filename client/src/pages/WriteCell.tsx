import { useEffect, useState, useMemo, useCallback } from 'react'

import Button from '#/components/Button'

import { EditorCore as CellEditorCore } from '#/components/cell-editor/editor/EditorCore';

import { useEditorInit as useCellEditorInit, useCellData, useRootId, useStructData } from '#/components/cell-editor/store/EditorState'

import { useMetadataState } from '#/components/editor/MetadataState';
import { MetadataInput } from '#/components/editor/MetadataInput'


import { autoSaveIntervalMs, localStorageKeys } from '#/misc/consts'

function WriteCell() {
    const cellInit = useCellEditorInit()
    useEffect(() => {
        cellInit()
    }, []);


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

    const metadata = useMetadataState();
    const [cellData, rootId, structData] = [useCellData(), useRootId(), useStructData()];

    const upload = useCallback(() => {
        console.log({
            mode: 'cell',
            metadata,
            cellData,
            structData
        });
    }, [metadata, cellData, structData]);

    return (
        <div className='cellEditorWrapper'>
            <MetadataInput />
            <hr />
            <CellEditorCore />
            <hr />
            <div className='buttonsWrapper'>
                <Button className='uploadButton'
                    onClick = { upload }
                >
                    업로드(console.log)
                </Button>
            </div>
        </div>
    );
}

export default WriteCell;