import React, { memo } from 'react'

import {
    useCombinedDispatch,
    useSingleCellType
} from '#/components/wood/states'

import { isParentType } from '#/components/wood/cell'

import { useIsOver } from './DndScope'
import { InterCellProps } from './Portal'

import { AddBox, ListAlt } from '@mui/icons-material'

import { useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

const maxDepth = 5

function _InterCell({ parentId, idx, depth }: InterCellProps){
    const cellType = useSingleCellType(parentId)
    const dispatch = useCombinedDispatch()

    const dndId = parentId + '@' + idx //assume that id do not use @
    const isOver = useIsOver(dndId)

    const { setNodeRef } = useDroppable({
        id: dndId,
        data: { parentId, idx }
    })

    depth = depth || 0

    if(depth > maxDepth){
        return null
    }

    const style : React.CSSProperties = {
        position: 'relative',
        zIndex: 4
    }

    return (
        <div style={ style } className={ 'interBlockHelper' + (isOver ? ' helperOver' : '') } ref={ setNodeRef }>
            <hr />
            <div className='addButtonsWrapper'>
                <button className='addContentCellButton'
                    onClick={(ev)=>{
                        ev.stopPropagation()
                        dispatch({
                            type: 'createChild',
                            parentId,
                            pos: idx,
                            cellType: 'text'
                        })
                    }}
                >
                    <AddBox />
                </button>
                {isParentType(cellType) && (depth < maxDepth) &&
                    <button className='addSectionCellButton'
                        onClick={(ev)=>{
                            ev.stopPropagation()
                            dispatch({
                                type: 'createChild',
                                parentId,
                                pos: idx,
                                cellType: 'section'
                            })
                        }}
                    >
                        <ListAlt />
                    </button>
                }
            </div>
        </div>
    )
}
export const InterCell = memo(_InterCell)