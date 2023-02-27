import React, { useCallback } from 'react';

import { BasicCell } from '#common/BasicCell';
import { RenderMode, Renderer, CellTypeRendererProps } from '../types-render';

import {
    useCellEditorAction,
} from '#/components/cell-editor/editor/EditorState'

import SingletonTextArea from '#/components/helpers/SingletonTextArea'

// export const rootCellName = 'root'
export interface RootCellField{
    // title: string
    // author: string
    mathMacroStr: string
}
export const rootCellDefault: RootCellField = {
    // title: '',
    // author: '',
    mathMacroStr: ''
}
type RootCell = BasicCell<RootCellField,'root'> // only used in this file

// renderers

function RootCellViewer({ mode, cell } : CellTypeRendererProps<RootCell>){
    // 뭐 넣지?

    // title / author will be rendered separately
    return (
        <div className='rootCell' >
            {mode === RenderMode.PREVIEW &&
                <div className='rootCellSettings'>
                    <code>
                        { cell.mathMacroStr }
                    </code>
                </div>
            }
        </div>
    )
}


function RootCellEditor({ cell }: Omit<CellTypeRendererProps<RootCell>,'mode'>){
    const editorAction = useCellEditorAction()

    const changeHandler : React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = useCallback((ev) => {
        ev.stopPropagation();
        ev.preventDefault();

        let change: Partial<RootCellField> = {
            mathMacroStr: ev.target.value
        };
        editorAction.update(cell.id, change);
    }, [cell.id]);

    return (
        <div className='editorRootCellWrapper'>
            <div className='rootCellSettings'>
                <SingletonTextArea
                    className='editorRootCellTextArea editorCell'
                    value={ cell.mathMacroStr }
                    onChange={ changeHandler }
                />
            </div>
        </div>
    )
}


export function RootCellRenderer({ mode, cell }: CellTypeRendererProps<RootCell>){
    if(mode !== RenderMode.EDITOR){
        return <RootCellViewer mode={ mode } cell={ cell } />
    }

    return <RootCellEditor cell={ cell } />
}