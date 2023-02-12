import React, { useCallback } from 'react';

import { BasicCell } from '#common/BasicCell';
import { RenderMode, Renderer, CellTypeRendererProps } from '../types-render';

import {
    useRenderData,
    useEditorAction,
} from '#/components/cell-editor/editor/EditorState'

import SingletonTextArea from '#/components/helpers/SingletonTextArea'

import Markdown from '#/components/markdown-lab/Markdown';

import 'katex/dist/katex.min.css';
import katex from 'katex';

// export const mathCellName = 'math'
export interface MathCellField{
    value: string
}
export const mathCellDefault: MathCellField = {
    value: ''
}
type MathCell = BasicCell<MathCellField,'math'> // only used in this file


//renderers

function MathCellViewer({ mode, cell } : CellTypeRendererProps<MathCell>){
    const { mathMacroObj } = useRenderData()
    const macros = { ...mathMacroObj };

    let innerHtml = '';
    try{
        innerHtml = katex.renderToString(cell.value, {
            displayMode: true,
            throwOnError: false,
            macros: macros,
            // globalGroup: true
        });
    } catch(e){}

    return (
        <div className='mathCell'>
            <div className='mathCellPreview'>
                {/* TODO: prevent repeat with markdown (perhaps maintain our own version of react-katex) */}
                <div className='math-display'
                    dangerouslySetInnerHTML={ { __html: innerHtml } }
                />
            </div>
        </div>
    )
}

function MathCellEditor({ cell }: Omit<CellTypeRendererProps<MathCell>,'mode'>){
    const editorAction = useEditorAction()

    const changeHandler : React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = useCallback((ev) => {
        ev.stopPropagation()
        ev.preventDefault()
        editorAction.update(cell.id, {
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