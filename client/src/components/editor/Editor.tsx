import { useState, useCallback, memo } from 'react';

import Button from '#/components/Button'

import { EditorCore as ClassicEditorCore } from '#/components/classic-editor/EditorCore'
import { EditorCore as CellEditorCore } from '#/components/wood/editor/EditorCore'

import { useClassicEditorInit, useClassicText } from '#/components/classic-editor/EditorState'

import { useEditorInit as useCellEditorInit, useCellData, useRootId, useStructData } from '#/components/wood/store/EditorState'

import { useMetadataState } from './MetadataState';
import { MetadataInput } from './MetadataInput'

export function Editor(){
    const metadata = useMetadataState();

    const [mode, setMode] = useState('classic'); // classic or cell.

    // initialize outside.
    const text = useClassicText();
    const [cellData, rootId, structData] = [useCellData(), useRootId(), useStructData()]

    const upload = useCallback(() => {
        var obj : {mode:string, value:any} = {
            mode,
            value: undefined
        }
        if(mode === 'classic'){
            obj.value = text;
        } else if(mode === 'cell'){
            obj.value = {
                cellData, structData
            };
        }
        console.log(metadata);
        console.log(obj);
    }, [metadata, mode, text, cellData, structData])

    return (
        <div className='cellEditorWrapper'>
            <MetadataInput />

            <hr />

            { mode === 'classic' &&
                <ClassicEditorCore />
            }
            { mode === 'cell' &&
                <CellEditorCore />
            }

            <hr />

            <div className='buttonsWrapper'>
                <Button className='toggleButton'
                    onClick = { () => { setMode( mode => mode === 'classic' ? 'cell' : 'classic' ) } }
                >
                    모드 전환(Classic / Cell)
                </Button>
                <Button className='uploadButton'
                    onClick = { upload }
                >
                    업로드(console.log)
                </Button>
            </div>
        </div>
    )
}