import { useEffect, useState, useMemo, useCallback, memo } from 'react';

import Button from '#/components/Button'

import { EditorCore as CellEditorCore } from '#/components/cell-editor/editor/EditorCore';
import { CellEditorProvider, useContent } from '#/components/cell-editor/editor/EditorState'

import { MetadataInput } from '#/components/editor/MetadataInput'

import { CellArticle } from '#/api/article';
import { useMetadataInit, useMetadataState, Metadata } from './MetadataState';

interface CellEditorProps{
    initArticle?: CellArticle;
    upload: (metadata: Metadata, content: CellArticle['content']) => any;
    // todo: autosave
};
export function CellEditor({ initArticle, upload }: CellEditorProps) {
    // initArticle === undefined ? 'create' : 'update'

    // init here.
    const metadataInit = useMetadataInit();
    useEffect(() => {
        metadataInit(initArticle?.metadata ?? {});
    }, [initArticle]);

    return (
        <CellEditorProvider init={ initArticle?.content }>
            <CellEditorInner upload={ upload } />
        </CellEditorProvider>
    );
}

// prevent rerender of this component when context has changed.
const MemoizedMetadataInput = memo(MetadataInput);
const MemoizedCore = memo(CellEditorCore);

function CellEditorInner({ upload }: CellEditorProps){
    const metadata = useMetadataState();
    const content = useContent();

    const uploadHandler = useCallback(() => {
        upload(metadata, content);
    }, [metadata, content]);

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