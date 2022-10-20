import { memo } from 'react'

import {
    useCombinedDispatch,
    useSingleCellFocused, 
} from '#/components/wood/states'

import {
    MemoizedCellRenderer, RenderMode,
} from '#/components/wood/cell'

import { CellIndicatorProps } from './Portal'

import { Toolbar } from './Toolbar'

function _CellIndicator({ id }: CellIndicatorProps){
    const isFocused = useSingleCellFocused(id)
    const mode = (isFocused? RenderMode.EDITOR : RenderMode.PREVIEW)

    const dispatch = useCombinedDispatch()

    return (
        <div id = { id }
            className={ 'cellContentWrapper' + (isFocused? ' editingCellWrapper' : '') }
            onClick = { (ev) => {
                ev.stopPropagation()
                !isFocused && dispatch({type:'focus', targetId:id})
            }}
        >
            <Toolbar id = { id } />
            <MemoizedCellRenderer id = { id } mode = { mode } />
        </div>
    )
}
export const CellIndicator = memo(_CellIndicator)