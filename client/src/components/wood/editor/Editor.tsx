import { useCombinedDispatch, useRootId } from '#/components/wood/states'

import { RootInput } from './RootInput'

import { DndScope } from './DndScope'

import { CellPortalScopeWith, CellPortalWith } from './Portal'
import { CellIndicator } from './CellIndicator'
import { InterCell } from './InterCell'
import { ChildrenWrapper } from './ChildrenWrapper'

import Button from '#/components/Button'

const CellPortalScope = CellPortalScopeWith(CellIndicator)
const [CellPortal, CellPortalDraggable] = CellPortalWith(InterCell, ChildrenWrapper)

interface EditorCoreProps{
    upload?: () => any
}

/**
 * Editor core.
 * 
 * `CombinedStateContext.Provider` and `CombinedDispatchContext.Provider` should be set on the component scope.
 */
export function EditorCore({ upload }: EditorCoreProps){
    const rootId = useRootId()
    const dispatch = useCombinedDispatch()

    return (
        <div className='cellEditorWrapper'
            onClick={() => dispatch({type: 'focus'})}
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