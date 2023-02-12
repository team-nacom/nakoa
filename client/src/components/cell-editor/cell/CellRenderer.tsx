import { memo, useState, useEffect } from 'react'
import isEqual from 'react-fast-compare'

import { match } from 'variant'

import { Cell, cellTypeStr } from './types'
import { CellRendererProps } from './types-render'

import { RootCellRenderer } from './cell-types/root'
import { SectionCellRenderer } from './cell-types/section'
import { TextCellRenderer } from './cell-types/text'
import { CodeCellRenderer } from './cell-types/code'
import { MathCellRenderer } from './cell-types/math'

import { useSingleCell, useSingleCellFocused } from '#/components/cell-editor/editor/EditorState'

export function CellRenderer({ mode, id }: CellRendererProps){
    const cell = useSingleCell(id)
    if(cell === undefined) return null

    return match(cell,{
        // exhaustive selection: if this spits some errors when commenting out 'default', check whether we've fed every renderers for each cellType correctly.
        'root': cell => RootCellRenderer({mode, cell}),
        'section': cell => SectionCellRenderer({mode, cell}),
        'text': cell => TextCellRenderer({mode, cell}),
        'code': cell => CodeCellRenderer({mode, cell}),
        'math': cell => MathCellRenderer({mode, cell}),
        default: () => null
    }, cellTypeStr)
}
export const MemoizedCellRenderer = memo(CellRenderer, isEqual)