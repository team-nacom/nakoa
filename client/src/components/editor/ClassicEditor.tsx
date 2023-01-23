import { useEffect, useState, useMemo, useCallback } from 'react';

import Button from '#/components/Button'

import { EditorCore as ClassicEditorCore } from '#/components/classic-editor/EditorCore';

import { useClassicEditorInit } from '#/components/classic-editor/EditorState';

import { MetadataInput } from '#/components/editor/MetadataInput'

import { ClassicArticle } from '#/api/article';
import { useMetadataInit } from './MetadataState';

interface ClassicEditorProps{
    initArticle?: ClassicArticle;
    upload: () => any;
};
export function ClassicEditor({ initArticle, upload }: ClassicEditorProps) {
    // initArticle === undefined ? 'create' : 'update'

    // init here.
    const classicInit = useClassicEditorInit()
    const metadataInit = useMetadataInit();
    useEffect(() => {
        metadataInit(initArticle?.metadata ?? {});
        classicInit(initArticle?.text ?? '');
    }, [initArticle]);

    return (
        <div className='cellEditorWrapper'>
            <MetadataInput {...initArticle?.metadata} />
            <hr />
            <ClassicEditorCore />
            <hr />
            <div className='buttonsWrapper'>
                <Button className='uploadButton'
                    onClick = { upload }
                >
                    업로드
                </Button>
            </div>
        </div>
    );
}