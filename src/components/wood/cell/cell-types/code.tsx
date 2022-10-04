import React, { useCallback } from 'react'

import { CellFrom } from '../types-common';
import { RenderMode, Renderer, CellTypeRendererProps } from '../types-render';

import {
    useRenderData,
    useCombinedDispatch
} from '#/components/wood/states'

// export const codeCellName = 'code'
export interface CodeCellField{
    value: string
}
export const codeCellDefault: CodeCellField = {
    value: ''
}
type CodeCell = CellFrom<CodeCellField,'code'> // only used in this file


//renderers

function CodeCellViewer({ mode, cell } : CellTypeRendererProps<CodeCell>){
    return (
        <div className='codeCell' style={ {width:'100%', border:'1px solid blue'} } >
            {cell.value}
        </div>
    )
}

function CodeCellEditor({ cell }: Omit<CellTypeRendererProps<CodeCell>,'mode'>){
    // const {} = useRenderData()
    const dispatch = useCombinedDispatch()

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


export function CodeCellRenderer({ mode, cell }: CellTypeRendererProps<CodeCell>){
    if(mode !== RenderMode.EDITOR){
        return <CodeCellViewer mode={ mode } cell={ cell } />
    }

    return <CodeCellEditor cell={ cell } />
}
