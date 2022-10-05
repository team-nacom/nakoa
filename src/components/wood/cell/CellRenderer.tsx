import { memo, useState, useEffect } from 'react'
import isEqual from 'react-fast-compare'

import { match } from 'variant'

import { Cell, cellTypeStr } from './types'
import { RenderMode, Renderer, CellTypeRendererProps, CellRendererProps } from './types-render'

import { TextCellRenderer } from './cell-types/text'
import { CodeCellRenderer } from './cell-types/code'
import { MathCellRenderer } from './cell-types/math'

import { useSingleCell, useSingleCellFocused } from '#/components/wood/states'

export function CellRenderer({ mode, id }: CellRendererProps){
    const cell = useSingleCell(id)
    if(cell === undefined) return null

    return match(cell,{
        // exhaustive selection: if this spits some errors, check whether we've fed every renderers for each cellType correctly.
        'text': cell => TextCellRenderer({mode, cell}),
        'code': cell => CodeCellRenderer({mode, cell}),
        'math': cell => MathCellRenderer({mode, cell}),
        default: () => null
    }, cellTypeStr)
}
export const MemoizedCellRenderer = memo(CellRenderer, isEqual)