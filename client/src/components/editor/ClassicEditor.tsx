import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useInterval } from 'usehooks-ts';

import Button from '#/components/Button'

import { EditorCore as ClassicEditorCore } from '#/components/classic-editor/EditorCore';

import { ClassicEditorProvider, useClassicText } from '#/components/classic-editor/EditorState';

import { MetadataInput } from '#/components/editor/MetadataInput'

import type { ClassicArticle } from '#/components/cell-editor/types';
import { MetadataProvider, Metadata, useMetadataState } from './MetadataState';

import { autoSaveIntervalMs as autosaveIntervalMsDefault } from '#/config/consts';

interface ClassicEditorProps{
    initArticle?: ClassicArticle;
    upload: (metadata: Metadata, text: string) => Promise<any>;
    autosave: (metadata: Metadata, text: string) => Promise<any>;
    removeAutosave?: (disableAutosave: () => any) => any;
};
export function ClassicEditor({ initArticle, upload, autosave, removeAutosave }: ClassicEditorProps) {
    // initArticle === undefined ? 'create' : 'update'

    return (
        <ClassicEditorProvider initText={ initArticle?.text }>
        <MetadataProvider {...(initArticle?.metadata ?? {})}>
            <ClassicEditorInner
                upload={ upload }
                autosave={ autosave }
                removeAutosave={ removeAutosave }
            />
        </MetadataProvider>
        </ClassicEditorProvider>
    );
}

// prevent rerender of this component when context has changed.
const MemoizedMetadataInput = memo(MetadataInput);
const MemoizedCore = memo(ClassicEditorCore);

function ClassicEditorInner({ upload, autosave, removeAutosave }: ClassicEditorProps){
    const metadata = useMetadataState();
    const text = useClassicText();

    const uploadHandler = useCallback(() => {
        upload(metadata, text);
    }, [metadata, text]);

    const autosaveHandler = useCallback(async () => {
        await autosave(metadata, text);
        setAutosavedUp();
    }, [metadata, text]);

    // autosave interval
    const [autosaveIntervalMs, setAutosaveIntervalMs] = useState<number | null>(autosaveIntervalMsDefault);

    // pass delay=null when we want to stop autosave.
    useInterval(autosaveHandler, autosaveIntervalMs);

    // overwrite autosave and reset autosave timer.
    const forceSaveHandler = useCallback(async () => {
        let tmp = autosaveIntervalMs;
        setAutosaveIntervalMs(null); 
        // await autosaveHandler();
        await autosave(metadata, text);
        setAutosavedUp();

        setAutosaveIntervalMs(tmp); // hope that it will reset timer
    }, [autosaveIntervalMs, metadata, text]);

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
            {/* <ClassicEditorCore /> */}
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