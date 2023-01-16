import { useEffect, useState, useCallback, useMemo } from 'react'

import { cellData as PfCellData, wood as PfWood } from '#/components/cell-editor/util/pfaffian'
import { pfaffian as PfText } from '#/components/classic-editor/pfaffian'

import Button from '#/components/Button'

import { EditorCore as ClassicEditorCore } from '#/components/classic-editor/EditorCore'
import { EditorCore as CellEditorCore } from '#/components/cell-editor/editor/EditorCore'

import { useClassicEditorInit, useClassicText } from '#/components/classic-editor/EditorState'

import { useEditorInit as useCellEditorInit, useCellData, useRootId, useStructData } from '#/components/cell-editor/store/EditorState'

import { useMetadataState } from '#/components/editor/MetadataState';
import { MetadataInput } from '#/components/editor/MetadataInput'

function Hidden() {
    // initialize editor state.
    // may need a single provider for this? see https://github.com/pmndrs/zustand#react-context
    const cellInit = useCellEditorInit()
    const classicInit = useClassicEditorInit()
    useEffect(() => {
        cellInit(PfCellData, PfWood.rootId, PfWood.structData)
        classicInit(PfText)
    }, [])

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

export default Hidden;