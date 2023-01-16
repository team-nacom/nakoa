import { useEditorAction, useRootId } from '#/components/cell-editor/store/EditorState'

import { DndScope } from './DndScope'

import { CellPortalScopeWith, CellPortalWith } from './Portal'
import { CellIndicator } from './CellIndicator'
import { InterCell } from './InterCell'
import { ChildrenWrapper } from './ChildrenWrapper'

const CellPortalScope = CellPortalScopeWith(CellIndicator)
const [CellPortal, CellPortalDraggable] = CellPortalWith(InterCell, ChildrenWrapper) // root cell is not draggable


export function EditorCore(){
    const rootId = useRootId()
    const editorAction = useEditorAction()

    return (
        <div className='allCellsWrapper'
            onClick={() => {
                editorAction.focus() // blur
            }}
        >
            <DndScope>
                <CellPortalScope>
                    <CellPortal key = { 'cell-' + rootId } id={ rootId } />
                </CellPortalScope>
            </DndScope>
        </div>
    )
}