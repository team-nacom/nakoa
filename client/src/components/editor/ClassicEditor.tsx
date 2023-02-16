import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useInterval } from 'usehooks-ts';

import Button from '#/components/Button'

import { EditorCore as ClassicEditorCore } from '#/components/classic-editor/EditorCore';

import { ClassicEditorProvider, useClassicText } from '#/components/classic-editor/EditorState';

import { MetadataInput } from '#/components/editor/MetadataInput'

import { ClassicArticle } from '#/api/article';
import { MetadataProvider, Metadata, useMetadataState } from './MetadataState';

import { autoSaveIntervalMs } from '#/config/consts';

interface ClassicEditorProps{
    initArticle?: ClassicArticle;
    upload: (metadata: Metadata, text: string) => any;
    autosave: (article: ClassicArticle) => any;
};
export function ClassicEditor({ initArticle, upload, autosave }: ClassicEditorProps) {
    // initArticle === undefined ? 'create' : 'update'

    return (
        <ClassicEditorProvider initText={ initArticle?.text }>
        <MetadataProvider {...(initArticle?.metadata ?? {})}>
            <ClassicEditorInner upload={ upload } autosave={ autosave } />
        </MetadataProvider>
        </ClassicEditorProvider>
    );
}

// prevent rerender of this component when context has changed.
const MemoizedMetadataInput = memo(MetadataInput);
const MemoizedCore = memo(ClassicEditorCore);

function ClassicEditorInner({ upload, autosave }: ClassicEditorProps){
    const metadata = useMetadataState();
    const text = useClassicText();

    const uploadHandler = useCallback(() => {
        upload(metadata, text);
    }, [metadata, text]);

    // this useInterval hook remembers previous closure and detects its change, so no need for dependency array.
    // pass delay=null when we want to stop autosave.
    useInterval(() => {
        autosave({
            mode: 'classic',
            metadata,
            text
        });
        console.log('autosaved');
    }, autoSaveIntervalMs);

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