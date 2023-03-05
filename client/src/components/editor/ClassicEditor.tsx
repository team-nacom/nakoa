import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useInterval } from 'usehooks-ts';

import Button from '#/components/Button'

import { EditorCore as ClassicEditorCore } from '#/components/classic-editor/EditorCore';

import { ClassicEditorProvider, useClassicText } from '#/components/classic-editor/EditorState';

import { MetadataInput } from '#/components/editor/MetadataInput'

import { ClassicArticle } from '#/api/article';
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
        console.log('autosaved on', new Date());
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
        setAutosaveIntervalMs(tmp); // hope that it will reset timer
    }, [autosaveIntervalMs, metadata, text]);

    const removeAutosaveHandler = useCallback(() => {
        if(removeAutosave === undefined) return;
        return removeAutosave(() => setAutosaveIntervalMs(null));
    }, [removeAutosave]);

    return (
        <div className='cellEditorWrapper'>
            <MemoizedMetadataInput />
            {/* <MetadataInput /> */}
            <hr />
            <MemoizedCore />
            {/* <ClassicEditorCore /> */}
            <hr />
            <div className='buttonsWrapper'>
                <Button className='uploadButton' onClick = { uploadHandler }>
                    업로드
                </Button>
                <Button className='removeAutosaveButton' onClick = { removeAutosaveHandler }>
                    임시저장 초기화
                </Button>
                <Button className='autosaveButton' onClick = { forceSaveHandler }>
                    임시저장
                </Button>
            </div>
        </div>
    )
}