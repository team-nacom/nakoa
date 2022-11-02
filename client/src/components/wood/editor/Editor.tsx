import { useEditorAction, useRootId } from '#/components/wood/store/EditorState'

import { RootInput } from './RootInput'

import { DndScope } from './DndScope'

import { CellPortalScopeWith, CellPortalWith } from './Portal'
import { CellIndicator } from './CellIndicator'
import { InterCell } from './InterCell'
import { ChildrenWrapper } from './ChildrenWrapper'

import Button from '#/components/Button'

const CellPortalScope = CellPortalScopeWith(CellIndicator)
const [CellPortal, CellPortalDraggable] = CellPortalWith(InterCell, ChildrenWrapper) // root cell is not draggable

interface EditorCoreProps{
    upload?: () => any
}

/**
 * Editor core.
 */
export function EditorCore({ upload }: EditorCoreProps){
    const rootId = useRootId()
    const editorAction = useEditorAction()

    return (
        <div className='cellEditorWrapper'
            onClick={() => {
                editorAction.focus() // blur
            }}
        >
            <div className='editorTextInput'>
                <RootInput />
            </div>

            <hr />
            <div className='allCellsWrapper'>
                <DndScope>
                    <CellPortalScope>
                        <CellPortal key = { 'cell-' + rootId } id={ rootId } />
                    </CellPortalScope>
                </DndScope>
            </div>
            <hr />

            <div className='buttonsWrapper'>
                <Button className='uploadButton' onClick = { upload }>
                    업로드(console.log)
                </Button>
            </div>
        </div>
    )
}