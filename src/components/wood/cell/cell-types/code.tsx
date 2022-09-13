import React from 'react';

import { CellFrom } from '../types-common';
import { RenderMode, Renderer, RendererProps } from '../types-render';

import {
    useRenderInfoScope,
    useCellDataScope
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
    return (<div className='CodeCell' style={ {width:'100%', border:'1px solid blue'} }>
        {cell.value}
    </div>)
}

function CodeCellEditor({ cell }: Omit<RendererProps<CodeCell>,'mode'>){
    const {} = useRenderInfoScope()
    const { dispatchCellData: dispatch } = useCellDataScope()

    const changeHandler : React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (ev) => {
        dispatch({
            type: 'update',
            id: cell.id,
            ...({
                value: ev.target.value
            } as Partial<CodeCellField>)
        })
    }

    return (
        <div className='editorCodeCellWrapper' style={ {width:'100%', border:'1px solid blue'} }>
            <textarea
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