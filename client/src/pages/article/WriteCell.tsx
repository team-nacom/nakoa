import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';

import { useCellData, useContent, useRootId, useStructData } from '#/components/cell-editor/editor/EditorState'

import { useMetadataState, Metadata } from '#/components/editor/MetadataState';

import { autoSaveIntervalMs, localStorageKeys } from '#/misc/consts';

import { ApplyLayout } from '#/layout/Apply';
import usePromise from '#/misc/usePromise';
import { Article, CellArticle, getArticle, postArticle } from '#/api/article';
import { CellEditor } from '#/components/editor/CellEditor';

function WriteCell() {

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

    // redirection state
    const [redirectTo, setRedirectTo] = useState<string>();
    const [message, setMessage] = useState<string>();

    const upload = useCallback((metadata: Metadata, content: CellArticle['content']) => {
        const article: CellArticle = {
            mode: 'cell',
            metadata,
            content
        }
        postArticle(article).then(({success, index})=>{
            if(success){
                setMessage('업로드에 성공했습니다!');
                setRedirectTo(`/article/view/${index}`);
            } else{
                setMessage('업로드에 실패했습니다.');
            }
        })
    }, []);

    if(redirectTo !== undefined) return <Redirect to={redirectTo} />;
    return <ApplyLayout title='글 작성하기'>
        <p>{message}</p>
        <CellEditor upload={ upload } />
    </ApplyLayout>;

    // Context.Consumer for rescue ??
}

export default WriteCell;