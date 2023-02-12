import React, { useCallback } from 'react'

import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'

import { BasicCell } from '#common/BasicCell';
import { RenderMode, Renderer, CellTypeRendererProps } from '../types-render';

import {
    useRenderData,
    useEditorAction,
} from '#/components/cell-editor/editor/EditorState'

import SingletonTextArea from '#/components/helpers/SingletonTextArea'

// export const codeCellName = 'code'
export interface CodeCellField{
    language: string
    value: string
}
export const codeCellDefault: CodeCellField = {
    language: '',
    value: ''
}
type CodeCell = BasicCell<CodeCellField,'code'> // only used in this file


//renderers

function CodeCellViewer({ mode, cell } : CellTypeRendererProps<CodeCell>){
    return (
        <div className='codeCell' >
            <summary className='codeCellLabel'>
                { cell.language }
            </summary>
            <SyntaxHighlighter className='codeCellPreview'
                language = { cell.language }
                style = { docco }
                wrapLongLines = { true }
            >
                {cell.value}
            </SyntaxHighlighter>
        </div>
    )
}

function CodeCellEditor({ cell }: Omit<CellTypeRendererProps<CodeCell>,'mode'>){
    // const {} = useRenderData()
    const editorAction = useEditorAction()

    const changeHandler : React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = useCallback((ev) => {
        ev.stopPropagation()
        ev.preventDefault()
        editorAction.update(cell.id, {
            value: ev.target.value
        } as Partial<CodeCellField>)
    }, [cell.id])

    const changeCaptionHandler : React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = useCallback((ev) => {
        ev.stopPropagation()
        ev.preventDefault()
        editorAction.update(cell.id, {
            language: ev.target.value
        } as Partial<CodeCellField>)
    }, [cell.id])

    return (
        <div className='editorCodeCellWrapper'>
            <div className='languageInput'>
                <label>language</label>
                <input className='codeCellCaptionForm'
                    value={ cell.language }
                    onChange={ changeCaptionHandler }
                />
            </div>
            <SingletonTextArea
                className='editorCodeCell editorCell'
                value={ cell.value }
                onChange={ changeHandler }
            />
        </div>
    )
}


export function CodeCellRenderer({ mode, cell }: CellTypeRendererProps<CodeCell>){
    if(mode !== RenderMode.EDITOR){
        return <CodeCellViewer mode={ mode } cell={ cell } />
    }

    return <CodeCellEditor cell={ cell } />
}
