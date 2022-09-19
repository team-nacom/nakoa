import React, { useCallback } from 'react';

import { CellFrom } from '../types-common';
import { RenderMode, Renderer, RendererProps } from '../types-render';

import {
    useRenderInfoScope,
    useDispatchCellDataScope
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
    function makeLog(str: string){
        console.log(str)
        return str
    }

    return (
        <div className='mathCell' style={ {width:'100%', border:'1px solid pink'} } >
            { cell.value }
        </div>
    )
}

function MathCellEditor({ cell }: Omit<RendererProps<MathCell>,'mode'>){
    // const {} = useRenderInfoScope()
    const dispatch = useDispatchCellDataScope()

    const changeHandler : React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = useCallback((ev) => {
        dispatch({
            type: 'update',
            id: cell.id,
            ...({
                value: ev.target.value
            } as Partial<MathCellField>)
        })
    }, [cell.id])

    return (
        <div className='editorMathCellWrapper' style={ {width:'100%', border:'1px solid pink'} }>
            { Date.now() }
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