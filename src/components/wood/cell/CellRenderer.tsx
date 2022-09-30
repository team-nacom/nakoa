import { memo, useState, useEffect } from 'react'
import isEqual from 'react-fast-compare'

import { match } from 'variant'

import { Cell, cellTypeStr } from './types'
import { RenderMode, Renderer, RendererProps } from './types-render'

import { TextCellRenderer } from './cell-types/text'
import { CodeCellRenderer } from './cell-types/code'
import { MathCellRenderer } from './cell-types/math'

export function CellRenderer({mode, cell}: RendererProps<Cell>){

    // for debugging.
    // const [ts, setTs] = useState(0)
    // useEffect(()=>{
    //     setTs(Date.now())
    // },[])

    // return <>
    //     { Date.now() }
    //     { match(cell,{
    //         'text': cell => <TextCellRenderer {...{mode, cell}} />,
    //         'code': cell => <CodeCellRenderer {...{mode, cell}} />,
    //         'math': cell => <MathCellRenderer {...{mode, cell}} />
    //     }, cellTypeStr) }
    // </>

    return match(cell,{
        // exhaustive selection: if this spits some errors, check whether we've fed every renderers for each cellType correctly.
        'text': cell => TextCellRenderer({mode, cell}),
        'code': cell => CodeCellRenderer({mode, cell}),
        'math': cell => MathCellRenderer({mode, cell})
    }, cellTypeStr)
}
export const MemoizedCellRenderer = memo(CellRenderer, isEqual)