import React, { useCallback } from 'react';

import { CellFrom } from '../types-common';
import { RenderMode, Renderer, CellTypeRendererProps } from '../types-render';

// RULE OF THUMB: other than useRenderInfoScope and useCellDispatch, scopes should not appear in each cell rendering.
import {
    useRenderData,
    useCombinedDispatch
} from '#/components/wood/states'

// export const rootCellName = 'root'
export interface RootCellField{
    title: string
    author: string
    mathMacroStr: string
}
export const rootCellDefault: RootCellField = {
    title: '',
    author: '',
    mathMacroStr: ''
}
type RootCell = CellFrom<RootCellField,'root'> // only used in this file

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
    const dispatch = useCombinedDispatch()

    const changeHandler : React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = useCallback((ev) => {
        ev.stopPropagation()
        ev.preventDefault()
        dispatch({
            type: 'update',
            id: cell.id,
            ...({
                mathMacroStr: ev.target.value
            } as Partial<RootCellField>)
        })
    }, [cell.id])

    return (
        <div className='editorRootCellWrapper'>
            <div className='rootCellSettings'>
                <textarea
                    className='editorRootCellTextArea editorCell'
                    value={ cell.mathMacroStr }
                    onChange={ changeHandler }
                />
            </div>
        </div>
    );
}


export function RootCellRenderer({ mode, cell }: CellTypeRendererProps<RootCell>){
    if(mode !== RenderMode.EDITOR){
        return <RootCellViewer mode={ mode } cell={ cell } />
    }

    return <RootCellEditor cell={ cell } />
}