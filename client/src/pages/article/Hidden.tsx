import { useEffect, useState, useCallback, useMemo } from 'react'

import { PfCell } from '#/components/cell-editor/util/pfaffian'
import { pfaffian as PfText } from '#/components/classic-editor/pfaffian'

import Button from '#/components/Button'

import { EditorCore as ClassicEditorCore } from '#/components/classic-editor/EditorCore'
import { EditorCore as CellEditorCore } from '#/components/cell-editor/editor/EditorCore'

import { useClassicText, ClassicEditorProvider } from '#/components/classic-editor/EditorState'

import {  useCellData, useRootId, useStructData, CellEditorProvider } from '#/components/cell-editor/editor/EditorState'

import { MetadataProvider, useMetadataState } from '#/components/editor/MetadataState';
import { MetadataInput } from '#/components/editor/MetadataInput'
import { ApplyLayout } from '#/layout/Apply'

function Hidden() {
    // initialize editor state.

    const [mode, setMode] = useState('classic'); // classic or cell.

    // initialize outside.
    // const text = useClassicText();
    // const [cellData, rootId, structData] = [useCellData(), useRootId(), useStructData()]

    // const upload = useCallback(() => {
    //     var obj : {mode:string, value:any} = {
    //         mode,
    //         value: undefined
    //     }
    //     if(mode === 'classic'){
    //         obj.value = text;
    //     } else if(mode === 'cell'){
    //         obj.value = {
    //             cellData, structData
    //         };
    //     }
    //     console.log(metadata);
    //     console.log(obj);
    // }, [metadata, mode, text, cellData, structData])
    
    return <ApplyLayout>
        <div className='cellEditorWrapper'>
            <MetadataProvider>
                <MetadataInput />
            </MetadataProvider>

            <hr />

            <ClassicEditorProvider initText={ PfText }>
            { mode === 'classic' &&
                <ClassicEditorCore />
            }
            </ClassicEditorProvider>

            <CellEditorProvider init={ PfCell }>
            { mode === 'cell' &&
                <CellEditorCore />
            }
            </CellEditorProvider>

            <hr />

            <div className='buttonsWrapper'>
                <Button className='toggleButton'
                    onClick = { () => { setMode( mode => mode === 'classic' ? 'cell' : 'classic' ) } }
                >
                    모드 전환(Classic / Cell)
                </Button>
                {/* <Button className='uploadButton'
                    onClick = { upload }
                >
                    console.log
                </Button> */}
            </div>
        </div>
    </ApplyLayout>;
}

export default Hidden;