import React, { useCallback } from 'react'

import { CellFrom } from '../types-common';
import { RenderMode, Renderer, RendererProps } from '../types-render';

import KeepAlive from '#/components/KeepAlive/KeepAlive'

import {
    useRenderInfoScope,
    useDispatchCellDataScope
} from '#/components/wood/scopes'

// export const codeCellName = 'code'
export interface CodeCellField{
    value: string
}
export const codeCellDefault: CodeCellField = {
    value: ''
}
type CodeCell = CellFrom<CodeCellField,'code'> // only used in this file


//renderers

function CodeCellViewer({ mode, cell } : RendererProps<CodeCell>){
    return (
        // <KeepAlive id = { cell.id }>
            <div className='codeCell' style={ {width:'100%', border:'1px solid blue'} } >
            {cell.value}
            </div>
        // </KeepAlive>
    )
}

function CodeCellEditor({ cell }: Omit<RendererProps<CodeCell>,'mode'>){
    // const {} = useRenderInfoScope()
    const dispatch = useDispatchCellDataScope()

    const changeHandler : React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = useCallback((ev) => {
        dispatch({
            type: 'update',
            id: cell.id,
            ...({
                value: ev.target.value
            } as Partial<CodeCellField>)
        })
    }, [cell.id])

    return (
        <div className='editorCodeCellWrapper' style={ {width:'100%', border:'1px solid blue'} }>
            { Date.now() }
            <textarea
                key={ `cell-${ cell.id }` }
                className='editorCodeCell editorCell'
                value={cell.value}
                onChange={ changeHandler }
            />
            <CodeCellViewer mode={ RenderMode.PREVIEW } cell={cell} />
        </div>
    );
}


export function CodeCellRenderer({ mode, cell }: RendererProps<CodeCell>){
    if(mode !== RenderMode.EDITOR){
        return <CodeCellViewer mode={ mode } cell={ cell } />
    }

    return <CodeCellEditor cell={ cell } />
}
