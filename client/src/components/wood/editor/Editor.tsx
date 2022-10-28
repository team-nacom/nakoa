import { useCombinedDispatch, useRootId } from '#/components/wood/states'

import { MetadataInput } from './MetadataInput'

import { DndScope } from './DndScope'

import { CellPortalScopeWith, CellPortalWith } from './Portal'
import { CellIndicator } from './CellIndicator'
import { InterCell } from './InterCell'
import { ChildrenWrapper } from './ChildrenWrapper'

const CellPortalScope = CellPortalScopeWith(CellIndicator)
const [CellPortal, CellPortalDraggable] = CellPortalWith(InterCell, ChildrenWrapper)

/**
 * Editor core.
 * 
 * `CombinedStateContext.Provider` and `CombinedDispatchContext.Provider` should be set on the component scope.
 */
export function EditorCore(){
    const rootId = useRootId()
    const dispatch = useCombinedDispatch()

    return (
        <div className='cellEditorWrapper'
            // collisionDetection={  }
            onClick={() => dispatch({type: 'focus'})}
        >
            <div className='editorTextInput'>
                <MetadataInput />
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
                <button>Upload(defunct)</button>
            </div>
        </div>
    )
}