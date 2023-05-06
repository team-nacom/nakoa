import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useInterval } from 'usehooks-ts';

import Button from '#/components/Button'

import { EditorCore as CellEditorCore } from '#/components/cell-editor/editor/EditorCore';
import { CellEditorProvider, useContent } from '#/components/cell-editor/editor/EditorState'

import { MetadataInput } from '#/components/editor/MetadataInput'

import { CellArticle } from '#/components/cell-editor/types';
import { useMetadataState, Metadata, MetadataProvider } from './MetadataState';

import { autoSaveIntervalMs as autosaveIntervalMsDefault } from '#/config/consts';
import { FileMapDataProvider, useFileMapState } from './FileMapState';

interface CellEditorProps{
    initArticle?: CellArticle;
    upload: (metadata: Metadata, content: CellArticle['content'], fileMap: Record<string, File>) => Promise<any>;
    autosave: (metadata: Metadata, content: CellArticle['content'], fileMap: Record<string, File>) => Promise<any>;
    removeAutosave?: (disableAutosave: () => any) => any;
};
export function CellEditor({ initArticle, upload, autosave, removeAutosave }: CellEditorProps) {
    // initArticle === undefined ? 'create' : 'update'

    const fileMap = useMemo(()=>{
        if(!initArticle) return {};
        const keys = initArticle.filePaths ?? [];
        const values = initArticle.files ?? []; // might not have been initialized.

        return Object.fromEntries(keys.map((k, i) => [k, values[i]]));
    }, [initArticle?.filePaths, initArticle?.files]);

    return (
        <CellEditorProvider init={ initArticle?.content }>
        <MetadataProvider {...(initArticle?.metadata ?? {})}>
        <FileMapDataProvider map={ fileMap }>
            <CellEditorInner
                upload={ upload }
                autosave={ autosave }
                removeAutosave={ removeAutosave }
            />
        </FileMapDataProvider>
        </MetadataProvider>
        </CellEditorProvider>
    );
}

// prevent rerender of this component when context has changed.
const MemoizedMetadataInput = memo(MetadataInput);
const MemoizedCore = memo(CellEditorCore);

function CellEditorInner({ upload, autosave, removeAutosave }: CellEditorProps){
    const metadata = useMetadataState();
    const content = useContent();
    const { map } = useFileMapState();
    
    const uploadHandler = useCallback(() => {
        upload(metadata, content, map);
    }, [metadata, content, map]);

    const autosaveHandler = useCallback(async () => {
        await autosave(metadata, content, map);
        setAutosavedUp();
    }, [metadata, content, map]);

    // autosave interval
    const [autosaveIntervalMs, setAutosaveIntervalMs] = useState<number | null>(autosaveIntervalMsDefault);

    // pass delay=null when we want to stop autosave.
    useInterval(autosaveHandler, autosaveIntervalMs);

    // overwrite autosave and reset autosave timer.
    const forceSaveHandler = useCallback(async () => {
        let tmp = autosaveIntervalMs;
        setAutosaveIntervalMs(null);
        // await autosaveHandler();
        await autosave(metadata, content, map);
        setAutosavedUp();

        setAutosaveIntervalMs(tmp); // hope that it will reset timer
    }, [autosaveIntervalMs, metadata, content, map]);

    const removeAutosaveHandler = useCallback(() => {
        if(removeAutosave === undefined) return;
        return removeAutosave(() => setAutosaveIntervalMs(null));
    }, [removeAutosave]);


    const [autosaved, setAutosaved] = useState(false);
    const setAutosavedUp = useCallback(() => {
        setAutosaved(true);
        setTimeout(() => setAutosaved(false), 3000);
    }, []);

    return (
        <div className='cellEditorWrapper'>
            <MemoizedMetadataInput />
            {/* <MetadataInput /> */}
            <hr />
            <MemoizedCore />
            {/* <CellEditorCore /> */}
            <hr />
            {autosaveIntervalMs &&
                <>
                    <label>자동저장 주기: <span style={ {display:'inline-block', width:'20px', textAlign:'right'} }>{ autosaveIntervalMs / 1000 }</span>초</label>
                    <input type='range' min={ 6000 } max={ 20000 } step={ 1000 } value={ autosaveIntervalMs } onChange={ (e) => setAutosaveIntervalMs(+e.target.value) } />
                </>
            }
            {autosaved &&
                <span>임시저장 완료</span>
            }
            <div className='buttonsWrapper'>
                <Button className='uploadButton' onClick = { uploadHandler }>
                    저장
                </Button>
                <Button className='removeAutosaveButton' onClick = { removeAutosaveHandler }>
                    임시저장 초기화
                </Button>
                <Button className='forceSaveButton' onClick = { forceSaveHandler }>
                    임시저장
                </Button>
            </div>
        </div>
    )
}