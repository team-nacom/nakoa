import { useCellEditorAction, useRootId } from '#/components/cell-editor/editor/EditorState'

import { DndScope } from './DndScope'

import { CellPortalScopeWith, CellPortalWith } from './Portal'
import { CellIndicator } from './CellIndicator'
import { InterCell } from './InterCell'
import { ChildrenWrapper } from './ChildrenWrapper'
import { FileInput } from '#/components/editor/FileInput';
import { AttachmentList } from '#/components/editor/FileList';

const CellPortalScope = CellPortalScopeWith(CellIndicator)
const [CellPortal, CellPortalDraggable] = CellPortalWith(InterCell, ChildrenWrapper) // root cell is not draggable


export function EditorCore(){
    const rootId = useRootId()
    const editorAction = useCellEditorAction()

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
            <FileInput
                imgUploadHandler={ undefined } // todo : create new image cell
                fileUploadHandler={ undefined }
            />
            <AttachmentList />
        </div>
    )
}