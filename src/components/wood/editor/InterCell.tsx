import { memo } from 'react'

import {
    useCombinedDispatch,
    useSingleCellType
} from '#/components/wood/states'

import { InterCellProps } from './Portal'

import { isParentType } from '#/components/wood/cell'

import { AddBox, ListAlt } from '@mui/icons-material'

const maxDepth = 5

function _InterCell({ parentId, idx, depth }: InterCellProps){
    const cellType = useSingleCellType(parentId)
    const dispatch = useCombinedDispatch()

    depth = depth || 0

    if(depth > maxDepth){
        return null
    }

    return (
        <div className='interBlockHelper'>
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