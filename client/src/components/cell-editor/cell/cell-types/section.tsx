import React, { useCallback } from 'react';

import { BasicCell } from '#/../../common/BasicCell';
import { RenderMode, Renderer, CellTypeRendererProps } from '../types-render';

import {
    useRenderData,
    useWoodAction,
} from '#/components/cell-editor/store/EditorState'

// import Markdown from '#/components/markdown/MarkdownRenderer'
import Markdown from '#/components/markdown-lab/Markdown'

// export const sectionCellName = 'section'
export interface SectionCellField{
    value: string,
    hideChildren: boolean
}
export const sectionCellDefault: SectionCellField = {
    value: '',
    hideChildren: false
}
type SectionCell = BasicCell<SectionCellField,'section'> // only used in this file

// renderers

function SectionCellViewer({ mode, cell } : CellTypeRendererProps<SectionCell>){
    const { mathMacroObj, label, labelTypewise } = useRenderData()
    const lbl = labelTypewise[cell.id] ?? []
    
    return (
        <div className='sectionCell' >
            <Markdown
                mathMacroObj={ mathMacroObj }
            >
                { '#'.repeat(lbl.length) + ' ' + lbl.join('.') + '. '  + cell.value }
            </Markdown>
        </div>
    )
}


function SectionCellEditor({ cell }: Omit<CellTypeRendererProps<SectionCell>,'mode'>){
    const woodAction = useWoodAction()

    const changeHandler : React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = useCallback((ev) => {
        ev.stopPropagation()
        ev.preventDefault()
        woodAction.update(cell.id, {
            value: ev.target.value
        } as Partial<SectionCellField>)
    }, [cell.id])

    return (
        <div className='editorSectionCell'>
            <SectionCellViewer mode={ RenderMode.PREVIEW } cell={ cell } />
            <input autoFocus
                className='editorSectionCellInput'
                value={ cell.value }
                onChange={ changeHandler }
            />
        </div>
    )
}


export function SectionCellRenderer({ mode, cell }: CellTypeRendererProps<SectionCell>){
    if(mode !== RenderMode.EDITOR){
        return <SectionCellViewer mode={ mode } cell={ cell } />
    }

    return <SectionCellEditor cell={ cell } />
}