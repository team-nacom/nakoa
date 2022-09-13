import React from 'react';

import { CellFrom } from '../types-common';
import { RenderMode, Renderer, RendererProps } from '../types-render';

import {
    useRenderInfoScope,
    useCellDataScope
} from '#/components/wood/scopes'

// export const mathCellName = 'math'
export interface MathCellField{
    value: string
}
export const mathCellDefault: MathCellField = {
    value: ''
}
type MathCell = CellFrom<MathCellField,'math'> // only used in this file


//renderers

function MathCellViewer({ mode, cell } : RendererProps<MathCell>){
    return (<div className='MathCell' style={ {width:'100%', border:'1px solid pink'} }>
        {cell.value}
    </div>)
}

function MathCellEditor({ cell }: Omit<RendererProps<MathCell>,'mode'>){
    const {} = useRenderInfoScope()
    const { dispatchCellData: dispatch } = useCellDataScope()

    const changeHandler : React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (ev) => {
        dispatch({
            type: 'update',
            id: cell.id,
            ...({
                value: ev.target.value
            } as Partial<MathCellField>)
        })
    }

    return (
        <div className='editorMathCellWrapper' style={ {width:'100%', border:'1px solid pink'} }>
            <textarea
                className='editorMathCell editorCell'
                value={cell.value}
                onChange={ changeHandler }
            />
            <MathCellViewer mode={ RenderMode.PREVIEW } cell={cell} />
        </div>
    );
}


export function MathCellRenderer({ mode, cell }: RendererProps<MathCell>){
    if(mode !== RenderMode.EDITOR){
        return <MathCellViewer mode={ mode } cell={ cell } />
    }

    return <MathCellEditor cell={ cell } />
}