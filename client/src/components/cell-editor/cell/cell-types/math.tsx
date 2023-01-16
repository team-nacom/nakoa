import React, { useCallback } from 'react';

import { CellFrom } from '../types-common';
import { RenderMode, Renderer, CellTypeRendererProps } from '../types-render';

import {
    useRenderData,
    useWoodAction,
} from '#/components/cell-editor/store/EditorState'

import SingletonTextArea from '#/components/helpers/SingletonTextArea'

import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex'; // todo(?): remove dependency of react-katex. just render with katex.

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
    const woodAction = useWoodAction()

    const changeHandler : React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = useCallback((ev) => {
        ev.stopPropagation()
        ev.preventDefault()
        woodAction.update(cell.id, {
            value: ev.target.value
        } as Partial<MathCellField>)
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