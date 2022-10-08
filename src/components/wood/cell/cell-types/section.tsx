import React, { useCallback } from 'react';

import { CellFrom } from '../types-common';
import { RenderMode, Renderer, CellTypeRendererProps } from '../types-render';

import {
    useRenderData,
    useCombinedDispatch
} from '#/components/wood/states'

import ReactMarkdown from 'react-markdown'
import RemarkGFM from 'remark-gfm'
import RemarkMath from 'remark-math'
import RehypeKatex from 'rehype-katex'


// export const sectionCellName = 'section'
export interface SectionCellField{
    value: string,
    hideChildren: boolean
}
export const sectionCellDefault: SectionCellField = {
    value: '',
    hideChildren: false
}
type SectionCell = CellFrom<SectionCellField,'section'> // only used in this file

// renderers

function SectionCellViewer({ mode, cell } : CellTypeRendererProps<SectionCell>){
    // todo: depths!!
    return (
        <div className='sectionCell' >
            <ReactMarkdown className='markdown'
                remarkPlugins = { [ RemarkGFM, RemarkMath ] }
                rehypePlugins = { [ RehypeKatex ] }
            >
                { '# ' + cell.value}
            </ReactMarkdown>
        </div>
    )
}


function SectionCellEditor({ cell }: Omit<CellTypeRendererProps<SectionCell>,'mode'>){
    const dispatch = useCombinedDispatch()

    const changeHandler : React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = useCallback((ev) => {
        ev.stopPropagation()
        ev.preventDefault()
        dispatch({
            type: 'update',
            id: cell.id,
            ...({
                value: ev.target.value
            } as Partial<SectionCellField>)
        })
    }, [cell.id])

    return (
        <div className='editorSectionCell'>
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