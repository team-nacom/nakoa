import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useInterval } from 'usehooks-ts';

import Button from '#/components/Button'

import { EditorCore as CellEditorCore } from '#/components/cell-editor/editor/EditorCore';
import { CellEditorProvider, useContent } from '#/components/cell-editor/editor/EditorState'

import { MetadataInput } from '#/components/editor/MetadataInput'

import { CellArticle } from '#/api/article-local';
import { useMetadataState, Metadata, MetadataProvider } from './MetadataState';

import { autoSaveIntervalMs as autosaveIntervalMsDefault } from '#/config/consts';

interface CellEditorProps{
    initArticle?: CellArticle;
    upload: (metadata: Metadata, content: CellArticle['content']) => Promise<any>;
    autosave: (metadata: Metadata, content: CellArticle['content']) => Promise<any>;
    removeAutosave?: (disableAutosave: () => any) => any;
};
export function CellEditor({ initArticle, upload, autosave, removeAutosave }: CellEditorProps) {
    // initArticle === undefined ? 'create' : 'update'

    return (
        <CellEditorProvider init={ initArticle?.content }>
        <MetadataProvider {...(initArticle?.metadata ?? {})}>
            <CellEditorInner
                upload={ upload }
                autosave={ autosave }
                removeAutosave={ removeAutosave }
            />
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
    
    const uploadHandler = useCallback(() => {
        upload(metadata, content);
    }, [metadata, content]);

    const autosaveHandler = useCallback(async () => {
        await autosave(metadata, content);
        setAutosavedUp();
    }, [metadata, content]);

    // autosave interval
    const [autosaveIntervalMs, setAutosaveIntervalMs] = useState<number | null>(autosaveIntervalMsDefault);

    // pass delay=null when we want to stop autosave.
    useInterval(autosaveHandler, autosaveIntervalMs);

    // overwrite autosave and reset autosave timer.
    const forceSaveHandler = useCallback(async () => {
        let tmp = autosaveIntervalMs;
        setAutosaveIntervalMs(null);
        // await autosaveHandler();
        await autosave(metadata, content);
        setAutosavedUp();

        setAutosaveIntervalMs(tmp); // hope that it will reset timer
    }, [autosaveIntervalMs, metadata, content]);

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
                    업로드
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