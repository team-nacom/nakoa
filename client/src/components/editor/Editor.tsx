import { useState, memo } from 'react';

import Button from '#/components/Button'

import { EditorCore as ClassicEditorCore } from '#/components/classic-editor/EditorCore'
import { EditorCore as CellEditorCore } from '#/components/wood/editor/EditorCore'

import { useClassicEditorInit, useClassicText } from '#/components/classic-editor/EditorState'

import { useEditorInit as useCellEditorInit, useCellData, useRootId, useStructData } from '#/components/wood/store/EditorState'

import { MetadataInput } from './MetadataInput'



export function Editor(){
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');

    const [mode, setMode] = useState('classic'); // classic or cell.

    // initialize outside.

    const text = useClassicText();
    const [cellData, rootId, structData] = [useCellData(), useRootId(), useStructData()]

    return (
        <div className='cellEditorWrapper'>
            <MetadataInput {...{title, setTitle, author, setAuthor}} />

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
                    onClick = { () => {
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
                        console.log(obj);
                    } }
                >
                    업로드(console.log)
                </Button>
            </div>
        </div>
    )
}