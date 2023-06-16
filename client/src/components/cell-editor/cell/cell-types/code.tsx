import React, { useCallback } from 'react'

import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'

import { BasicCell } from '#common/BasicCell';
import { RenderMode, Renderer, CellTypeRendererProps } from '../types-render';

import {
    useRenderData,
    useCellEditorAction,
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
    const editorAction = useCellEditorAction()

    const changeHandler : React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = useCallback((ev) => {
        ev.stopPropagation()
        ev.preventDefault()
        let change: Partial<CodeCellField> = {
            value: ev.target.value
        };
        editorAction.update(cell.id, change);
    }, [cell.id]);

    const changeCaptionHandler : React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = useCallback((ev) => {
        ev.stopPropagation()
        ev.preventDefault()
        editorAction.update(cell.id, {
            language: ev.target.value
        } as Partial<CodeCellField>)
    }, [cell.id]);

    const keyDownHandler: React.KeyboardEventHandler<HTMLTextAreaElement> = useCallback((ev) => {
        if(ev.key === 'Tab'){ // support indentation.
            // currently we're only using textarea-based code editor
            // so don't expect to much!

            ev.preventDefault();

            let start = ev.currentTarget.selectionStart;
            let end = ev.currentTarget.selectionEnd;

            let beforeValue = ev.currentTarget.value.slice(0, start);
            let afterValue = ev.currentTarget.value.slice(start);

            let change: Partial<CodeCellField> = {
                value: beforeValue + '    ' + afterValue, // 4 space as for indentation
            };
            editorAction.update(cell.id, change);

            ev.currentTarget.selectionStart = start + 4;
            ev.currentTarget.selectionEnd = end + 4;
        }

        // todo: keydown handler ?

    }, [cell.id]);

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
                onKeyDown={ keyDownHandler }
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
