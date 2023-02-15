import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useInterval } from 'usehooks-ts';

import Button from '#/components/Button'

import { EditorCore as CellEditorCore } from '#/components/cell-editor/editor/EditorCore';
import { CellEditorProvider, useContent } from '#/components/cell-editor/editor/EditorState'

import { MetadataInput } from '#/components/editor/MetadataInput'

import { CellArticle } from '#/api/article';
import { useMetadataState, Metadata, MetadataProvider } from './MetadataState';
import { autoSaveIntervalMs } from '#/misc/consts';

interface CellEditorProps{
    initArticle?: CellArticle;
    upload: (metadata: Metadata, content: CellArticle['content']) => any;
    autosave: (article: CellArticle) => any;
};
export function CellEditor({ initArticle, upload, autosave }: CellEditorProps) {
    // initArticle === undefined ? 'create' : 'update'

    return (
        <CellEditorProvider init={ initArticle?.content }>
        <MetadataProvider {...(initArticle?.metadata ?? {})}>
            <CellEditorInner upload={ upload } autosave={ autosave } />
        </MetadataProvider>
        </CellEditorProvider>
    );
}

// prevent rerender of this component when context has changed.
const MemoizedMetadataInput = memo(MetadataInput);
const MemoizedCore = memo(CellEditorCore);

function CellEditorInner({ upload, autosave }: CellEditorProps){
    const metadata = useMetadataState();
    const content = useContent();
    
    const uploadHandler = useCallback(() => {
        upload(metadata, content);
    }, [metadata, content]);

    // this useInterval hook remembers previous closure and detects its change, so no need for dependency array.
    // pass delay=null when we want to stop autosave.
    useInterval(() => {
        autosave({
            mode: 'cell',
            metadata,
            content
        });
        console.log('autosaved');
    }, autoSaveIntervalMs);

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
            </div>
        </div>
    )
}