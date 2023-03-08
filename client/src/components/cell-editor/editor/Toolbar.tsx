import { useCallback, memo } from 'react'

import {
    useCellEditorAction,

    useSingleCell, useSingleCellType, useSingleCellFocused, useSingleCellChildren, useSingleCellHideChildren, useSingleCellLabelTypewise,
} from '#/components/cell-editor/editor/EditorState'

import {
    Cell, CellType, cellTypeStr,
    defaultFields, isParentType, labelType
} from '#/components/cell-editor/cell'

import {
    CellIndicatorProps
} from './Portal'

import isEqual from 'react-fast-compare'

import { Icon } from '@mui/material';

function CellLabel({ id }: CellIndicatorProps){
    const cell = useSingleCell(id)
    const lbl = useSingleCellLabelTypewise(id)
    return <>{ `(${ labelType(cell) }) ${ lbl.join('.') }` }</>
}

function _Toolbar({ id }: CellIndicatorProps){
    const cell = useSingleCell(id)
    const childIds = useSingleCellChildren(id)
    const hide = useSingleCellHideChildren(id)
    const isFocused = useSingleCellFocused(id)

    const editorAction = useCellEditorAction()

    const changeCellTypeHandlerFactory = useCallback((targetType: CellType) => (() => {
        const { [cellTypeStr]: cellType, id: _, ...fields } = cell

        if(cellType === targetType) return
        if((
            isEqual(fields, defaultFields[cellType])
            && !((childIds ?? []).length > 0)
        )
            || window.confirm('셀 타입을 변경하면 하위 셀이 삭제되며 내용이 초기화됩니다. 정말로 변경하시겠습니까?')
        ){
            editorAction.changeType(id, targetType)
        }
    }), [cell, childIds, id])

    const deleteHandler = useCallback(()=>{
        const { [cellTypeStr]: cellType, id: unused, ...fields } = cell

        if((
            isEqual(fields, defaultFields[cellType])
            && !((childIds ?? []).length > 0)
        )
            || window.confirm('정말로 셀과 하위 셀을 삭제하시겠습니까?')
        ){
            editorAction.remove(id)
        }
    }, [cell, childIds, id])

    if(cell === undefined) return null
    
    const { [cellTypeStr]: cellType } = cell

    return <div className='cellToolbar'>
        <div className='cellOptions'>
            {cellType !== 'root' && <>
                {cellType !== 'section' && <>
                    {isFocused && <>
                        <button className='cellOptionButton'
                            onClick={ changeCellTypeHandlerFactory('text') }
                        >
                            <Icon>article</Icon>
                        </button>
                        <button className='cellOptionButton'
                            onClick={ changeCellTypeHandlerFactory('math') }
                        >
                            <Icon>calculate</Icon>
                        </button>
                        <button className='cellOptionButton'
                            onClick={ changeCellTypeHandlerFactory('code') }
                        >
                            <Icon>code</Icon>
                        </button>
                        <button className='cellOptionButton'
                            onClick={ changeCellTypeHandlerFactory('image') }
                        >
                            <Icon>image</Icon>
                        </button>
                    </>}
                </>}
            </>}
            {cellType !== 'root' && <>
                {isFocused &&
                    <button className='cellOptionButton'
                        onClick={ (ev) => {
                            ev.stopPropagation()
                            editorAction.focus() // blur
                        } }
                    >
                        <Icon>close</Icon>
                    </button>
                }
                {cellType === 'section' && <>
                    <input type='checkbox'
                        id={ 'hide-' + id }
                        defaultChecked={ hide /* cell.hideChildren */ }
                        onClick={ (ev) => {
                            ev.stopPropagation()
                            editorAction.toggleHideChildren(id)
                            editorAction.toggleHideChildren(id)
                        } }
                    />
                    <label className='cellOptionButton'
                        htmlFor={ 'hide-' + id }
                        onClick={ (ev) => { ev.stopPropagation() } }
                    >
                        <Icon>arrow_drop_down</Icon>
                    </label>
                </>}
                <button className='cellOptionButton'
                    onClick={ deleteHandler }
                >
                    <Icon>delete</Icon>
                </button>
            </>}
            {cellType === 'root' &&
                <button
                    className='cellOptionButton'
                    onClick={()=>{
                        editorAction.updateRenderData()
                    }}
                >
                    <Icon>update</Icon>
                </button>
            }
        </div>
        <div className='cellInfo'>
            <span className='cellId'>
                <span className='cellInfoIcon'><Icon>tag</Icon></span>
                <span className='cellInfoText'>{id}</span>
            </span>
            <span className='cellPos'>
                <span className='cellInfoIcon'><Icon>format_list_numbered_rtl</Icon></span>
                <span className='cellInfoText'><CellLabel id={id} /></span>
            </span>
        </div>
    </div>
}
export const Toolbar = memo(_Toolbar)