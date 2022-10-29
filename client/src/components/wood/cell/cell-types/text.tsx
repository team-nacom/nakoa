import React, { useCallback } from 'react';

import { CellFrom } from '../types-common';
import { RenderMode, Renderer, CellTypeRendererProps } from '../types-render';

import {
    useRenderData,
    useCombinedDispatch
} from '#/components/wood/states'

import SingletonTextArea from '#/components/helpers/SingletonTextArea'

// import Markdown from '#/components/markdown/MarkdownRenderer'
import Markdown from '#/components/markdown-lab/Markdown'

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
    const { mathMacroObj, Label, LabelTypewise } = useRenderData()

    return (
        <div className='textCell'>
            <Markdown
                mathMacroObj={ mathMacroObj }
                perrefMap={ LabelTypewise }
            >
                {cell.value}
            </Markdown>
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
            <SingletonTextArea
                className='editorTextCell editorCell'
                value={cell.value}
                onChange={ changeHandler }
            />
            <TextCellViewer mode={ RenderMode.PREVIEW } cell={cell} />
        </div>
    )
}


export function TextCellRenderer({ mode, cell }: CellTypeRendererProps<TextCell>){
    if(mode !== RenderMode.EDITOR){
        return <TextCellViewer mode={ mode } cell={ cell } />
    }

    return <TextCellEditor cell={ cell } />
}