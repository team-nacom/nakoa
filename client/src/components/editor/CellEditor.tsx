import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useInterval } from 'usehooks-ts';

import Button from '#/components/Button'

import { EditorCore as CellEditorCore } from '#/components/cell-editor/editor/EditorCore';
import { CellEditorProvider, useContent } from '#/components/cell-editor/editor/EditorState'

import { MetadataInput } from '#/components/editor/MetadataInput'

import { CellArticle } from '#/api/article';
import { useMetadataState, Metadata, MetadataProvider } from './MetadataState';

import { autoSaveIntervalMs as autosaveIntervalMsDefault } from '#/config/consts';

interface CellEditorProps{
    initArticle?: CellArticle;
    upload: (metadata: Metadata, content: CellArticle['content']) => any;
    autosave: (article: CellArticle) => any;
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

    // autosave interval
    const [autosaveIntervalMs, setAutosaveIntervalMs] = useState<number | null>(autosaveIntervalMsDefault);

    const removeAutosaveHandler = useCallback(() => {
        if(removeAutosave === undefined) return;
        return removeAutosave(() => setAutosaveIntervalMs(null));
    }, [removeAutosave]);

    // this useInterval hook remembers previous closure and detects its change, so no need for dependency array.
    // pass delay=null when we want to stop autosave.
    useInterval(() => {
        autosave({
            mode: 'cell',
            metadata,
            content
        });
        console.log('autosaved');
    }, autosaveIntervalMs);

    return (
        <div className='cellEditorWrapper'>
            <MemoizedMetadataInput />
            {/* <MetadataInput /> */}
            <hr />
            <MemoizedCore />
            {/* <CellEditorCore /> */}
            <hr />
            <div className='buttonsWrapper'>
                <Button className='uploadButton'
                    onClick = { uploadHandler }
                >
                    업로드
                </Button>
                <Button className='removeAutosaveButton'
                    onClick = { removeAutosaveHandler }
                >
                    임시저장 초기화
                </Button>
            </div>
        </div>
    )
}