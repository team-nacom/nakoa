import { useEffect, useState, useMemo, useCallback } from 'react';

import Button from '#/components/Button'

import { EditorCore as CellEditorCore } from '#/components/cell-editor/editor/EditorCore';

import { useEditorInit as useCellEditorInit } from '#/components/cell-editor/store/EditorState'

import { MetadataInput } from '#/components/editor/MetadataInput'

import { CellArticle } from '#/api/article';
import { useMetadataInit } from './MetadataState';

interface CellEditorProps{
    initArticle?: CellArticle;
    upload: () => any;
};
export function CellEditor({ initArticle, upload }: CellEditorProps) {
    // initArticle === undefined ? 'create' : 'update'

    // init here.
    const cellInit = useCellEditorInit();
    const metadataInit = useMetadataInit();
    useEffect(() => {
        metadataInit(initArticle?.metadata ?? {});
        cellInit(
            initArticle?.content.cellData,
            initArticle?.content.rootId,
            initArticle?.content.structData
        );
    }, [initArticle]);

    return (
        <div className='cellEditorWrapper'>
            <MetadataInput {...initArticle?.metadata} />
            <hr />
            <CellEditorCore />
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