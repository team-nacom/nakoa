import { useEffect, useState, useMemo, useCallback } from 'react';

import Button from '#/components/Button';

import { EditorCore as ClassicEditorCore } from '#/components/classic-editor/EditorCore';

import { useClassicEditorInit, useClassicText } from '#/components/classic-editor/EditorState';

import { useMetadataState } from '#/components/editor/MetadataState';
import { MetadataInput } from '#/components/editor/MetadataInput';

import { autoSaveIntervalMs, localStorageKeys } from '#/misc/consts'

function WriteClassic() {
    const classicInit = useClassicEditorInit()
    useEffect(() => {
        classicInit('')
    }, []);

    const metadata = useMetadataState();
    const text = useClassicText();

    const upload = useCallback(() => {
        console.log({
            mode: 'classic',
            metadata,
            text
        });
    }, [metadata, text]);

    return (
        <div className='cellEditorWrapper'>
            <MetadataInput />
            <hr />
            <ClassicEditorCore />
            <hr />
            <div className='buttonsWrapper'>
                <Button className='uploadButton'
                    onClick = { upload }
                >
                    업로드(console.log)
                </Button>
            </div>
        </div>
    );
}

export default WriteClassic;