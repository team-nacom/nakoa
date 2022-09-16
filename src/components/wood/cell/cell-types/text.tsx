import React, { useCallback } from 'react';

import { CellFrom } from '../types-common';
import { RenderMode, Renderer, RendererProps } from '../types-render';

import KeepAlive from '#/components/KeepAlive/KeepAlive'

// RULE OF THUMB: other than useRenderInfoScope and useDispatchCellDataScope, scopes should not be avoided in each cell rendering.
import {
    useRenderInfoScope,
    useDispatchCellDataScope
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
    return (
        // <KeepAlive id = { cell.id }>
            <div className='textCell' style={ {width:'100%', border:'1px solid black'} } >
            {cell.value}
            </div>
        // </KeepAlive>
    )
}



function TextCellEditor({ cell }: Omit<RendererProps<TextCell>,'mode'>){
    // const {} = useRenderInfoScope()
    const dispatch = useDispatchCellDataScope()

    const changeHandler : React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = useCallback((ev) => {
        ev.stopPropagation()
        ev.preventDefault()
        dispatch({
            type: 'update',
            id: cell.id,
            ...({
                value: ev.target.value
            } as Partial<TextCellField>)
        })
    }, [cell.id])

    return (
        <div className='editorTextCellWrapper' style={ {width:'100%', border:'1px solid black'} }>
            { Date.now() }
            <textarea
                className='editorTextCell editorCell'
                value={cell.value}
                onChange={ changeHandler }
            />
            <TextCellViewer mode={ RenderMode.PREVIEW } cell={cell} />
        </div>
    );
}


export function TextCellRenderer({ mode, cell }: RendererProps<TextCell>){
    if(mode !== RenderMode.EDITOR){
        return <TextCellViewer mode={ mode } cell={ cell } />
    }

    return <TextCellEditor cell={ cell } />
}