import { useEffect, useState, useMemo, useCallback, memo } from 'react';

import Button from '#/components/Button'

import { EditorCore as ClassicEditorCore } from '#/components/classic-editor/EditorCore';

import { ClassicEditorProvider, useClassicText } from '#/components/classic-editor/EditorState';

import { MetadataInput } from '#/components/editor/MetadataInput'

import { ClassicArticle, Metadata } from '#common/Article';
import { useMetadataInit, useMetadataState } from './MetadataState';

interface ClassicEditorProps{
    initArticle?: ClassicArticle;
    upload: (metadata: Metadata, text: string) => any;
    // todo: autosave.
};
export function ClassicEditor({ initArticle, upload }: ClassicEditorProps) {
    // initArticle === undefined ? 'create' : 'update'

    // init here.

    const metadataInit = useMetadataInit();
    useEffect(() => {
        metadataInit(initArticle?.metadata ?? {});
    }, [initArticle]);

    return (
        <ClassicEditorProvider initText={ initArticle?.text }>
            {/* todo: metadata provider also */}
            <ClassicEditorInner upload={ upload } />
        </ClassicEditorProvider>
    );
}

// prevent rerender of this component when context has changed.
const MemoizedMetadataInput = memo(MetadataInput);
const MemoizedCore = memo(ClassicEditorCore);

function ClassicEditorInner({ upload }: ClassicEditorProps){
    const metadata = useMetadataState();
    const text = useClassicText();

    const uploadHandler = useCallback(() => {
        upload(metadata, text);
    }, [metadata, text]);

    return (
        <div className='cellEditorWrapper'>
            <MemoizedMetadataInput />
            {/* <MetadataInput /> */}
            <hr />
            <MemoizedCore />
            {/* <ClassicEditorCore /> */}
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