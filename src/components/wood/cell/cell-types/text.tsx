import React from 'react';

import { CellFrom } from '../types-common';
import { RenderMode, Renderer, RendererProps } from '../types-render';

// RULE OF THUMB: other than useRenderInfoScope and useCellDataScope(for updating state), scopes should not be avoided in each cell rendering.
import {
    useRenderInfoScope,
    useCellDataScope
} from '#/components/wood/scopes'


// export const textCellName = 'text'
export interface TextCellField{
    value: string
}
export const textCellDefault: TextCellField = {
    value: ''
}
type TextCell = CellFrom<TextCellField,'text'> // only used in this file

// renderers

function TextCellViewer({ mode, cell } : RendererProps<TextCell>){
    return (<div className='textCell' style={ {width:'100%', border:'1px solid black'} } >
        {cell.value}
    </div>)
}

function TextCellEditor({ cell }: Omit<RendererProps<TextCell>,'mode'>){
    const {} = useRenderInfoScope()
    const { cellData, dispatchCellData: dispatch } = useCellDataScope()

    const _cell = cellData[cell.id] as TextCell;

    const changeHandler : React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (ev) => {
        dispatch({
            type: 'update',
            id: cell.id,
            ...({
                value: ev.target.value
            } as Partial<TextCellField>)
        })
    }

    return (
        <div className='editorTextCellWrapper' style={ {width:'100%', border:'1px solid black'} }>
            <textarea
                className='editorTextCell editorCell'
                value={_cell.value}
                onChange={ changeHandler }
            />
            <TextCellViewer mode={ RenderMode.PREVIEW } cell={_cell} />
        </div>
    );
}


export function TextCellRenderer({ mode, cell }: RendererProps<TextCell>){
    if(mode !== RenderMode.EDITOR){
        return <TextCellViewer mode={ mode } cell={ cell } />
    }

    return <TextCellEditor cell={ cell } />
}