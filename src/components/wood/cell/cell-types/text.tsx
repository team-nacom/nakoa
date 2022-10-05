import React, { useCallback } from 'react';

import { CellFrom } from '../types-common';
import { RenderMode, Renderer, CellTypeRendererProps } from '../types-render';

// RULE OF THUMB: other than useRenderInfoScope and useCellDispatch, scopes should not appear in each cell rendering.
import {
    useRenderData,
    useCombinedDispatch
} from '#/components/wood/states'


import ReactMarkdown from 'react-markdown'


// export const textCellName = 'text'
export interface TextCellField{
    value: string
}
export const textCellDefault: TextCellField = {
    value: ''
}
type TextCell = CellFrom<TextCellField,'text'> // only used in this file

// renderers

function TextCellViewer({ mode, cell } : CellTypeRendererProps<TextCell>){
    return (
        <div className='textCell' style={ {width:'100%', border:'1px solid black'} } >
            { Date.now() }
            <br />
            <ReactMarkdown className='markdown'>
                {cell.value}
            </ReactMarkdown>
        </div>
    )
}



function TextCellEditor({ cell }: Omit<CellTypeRendererProps<TextCell>,'mode'>){
    // const {} = useRenderData()
    const dispatch = useCombinedDispatch()

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
        <div className='editorTextCellWrapper'>
            <textarea
                className='editorTextCell editorCell'
                value={cell.value}
                onChange={ changeHandler }
            />
            <TextCellViewer mode={ RenderMode.PREVIEW } cell={cell} />
        </div>
    );
}


export function TextCellRenderer({ mode, cell }: CellTypeRendererProps<TextCell>){
    if(mode !== RenderMode.EDITOR){
        return <TextCellViewer mode={ mode } cell={ cell } />
    }

    return <TextCellEditor cell={ cell } />
}