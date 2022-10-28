import React, { useCallback } from 'react';

import { CellFrom } from '../types-common';
import { RenderMode, Renderer, CellTypeRendererProps } from '../types-render';

import {
    useRenderData,
    useCombinedDispatch
} from '#/components/wood/states'

import SingletonTextArea from '#/components/helpers/SingletonTextArea'

import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';

// export const mathCellName = 'math'
export interface MathCellField{
    value: string
}
export const mathCellDefault: MathCellField = {
    value: ''
}
type MathCell = CellFrom<MathCellField,'math'> // only used in this file


//renderers

function MathCellViewer({ mode, cell } : CellTypeRendererProps<MathCell>){
    const { mathMacroObj } = useRenderData()

    return (
        <div className='mathCell'>
            <div className='mathCellPreview'>
                <TeX block
                    settings={ { macros: mathMacroObj } }
                >
                    { cell.value }
                </TeX>
            </div>
        </div>
    )
}

function MathCellEditor({ cell }: Omit<CellTypeRendererProps<MathCell>,'mode'>){
    const dispatch = useCombinedDispatch()

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
        <div className='editorMathCellWrapper'>
            <SingletonTextArea
                className='editorMathCell editorCell'
                value={cell.value}
                onChange={ changeHandler }
            />
            <MathCellViewer mode={ RenderMode.PREVIEW } cell={cell} />
        </div>
    )
}


export function MathCellRenderer({ mode, cell }: CellTypeRendererProps<MathCell>){
    if(mode !== RenderMode.EDITOR){
        return <MathCellViewer mode={ mode } cell={ cell } />
    }

    return <MathCellEditor cell={ cell } />
}