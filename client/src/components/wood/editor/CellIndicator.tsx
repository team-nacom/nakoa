import { memo } from 'react'

import {
    useEditorAction,
    useSingleCellFocused, 
} from '#/components/wood/store/EditorState'

import {
    MemoizedCellRenderer, RenderMode,
} from '#/components/wood/cell'

import { CellIndicatorProps } from './Portal'
import { Toolbar } from './Toolbar'

function _CellIndicator({ id }: CellIndicatorProps){
    const isFocused = useSingleCellFocused(id)
    const mode = (isFocused? RenderMode.EDITOR : RenderMode.PREVIEW)

    const editorAction = useEditorAction()

    return (
        <div id={ id }
            className={ 'cellContentWrapper' + (isFocused? ' editingCellWrapper' : '') }
            onClick = { (ev) => {
                ev.stopPropagation()
                !isFocused && editorAction.focus(id)
            }}
        >
            <Toolbar id = { id } />
            <MemoizedCellRenderer id = { id } mode = { mode } />
        </div>
    )
}
export const CellIndicator = memo(_CellIndicator)