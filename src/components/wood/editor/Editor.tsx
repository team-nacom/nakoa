import { useState, useReducer, useCallback, useEffect, useMemo, PropsWithChildren } from 'react'

import {
    useCombinedDispatch, useSingleCell, useSingleCellFocused, useRootId, useSingleCellChildren
} from '#/components/wood/states'

import {
    MemoizedCellRenderer, RenderMode,
    CellType, cellTypeStr,
    defaultFields
} from '#/components/wood/cell'

import {
    CellPortalScopeWith, CellIndicatorProps,
    CellPortalWith, InterCellProps
} from './CellPortal'

import isEqual from 'react-fast-compare'

import {
    AddBox,
    Article, Calculate, Code, Image, Tag
} from '@mui/icons-material'

function CellToolbar({ id }: CellIndicatorProps){
    const cell = useSingleCell(id)
    const childIds = useSingleCellChildren(id)
    const dispatch = useCombinedDispatch()

    const changeCellTypeHandlerFactory = useCallback((targetType: CellType) => (() => {
        const { [cellTypeStr]: cellType, id: _, ...fields } = cell

        if(cellType === targetType) return
        if((
            isEqual(fields, defaultFields[cellType])
            && !(childIds.length > 0)
        )
            || window.confirm('셀 타입을 변경하면 하위 셀이 삭제되며 내용이 초기화됩니다. 정말로 변경하시겠습니까?')
        ){
            dispatch({
                type: 'changeType',
                cellType: targetType,
                id
            })
        }
    }), [cell, childIds])

    const deleteHandler = useCallback(()=>{
        const { [cellTypeStr]: cellType, id: _, ...fields } = cell

        if((
            isEqual(fields, defaultFields[cellType])
            && !(childIds.length > 0)
        )
            || window.confirm('정말로 셀과 하위 셀을 삭제하시겠습니까?')
        ){
            dispatch({
                type: 'remove',
                targetId: id
            })
        }
    }, [cell, childIds])

    return <div className='cellToolbar'>
        <div className='cellOptions'>
            <button className='cellOptionButton'
                onClick={ changeCellTypeHandlerFactory('text') }
            >
                <Article />
            </button>
            <button className='cellOptionButton'
                onClick={ changeCellTypeHandlerFactory('math') }
            >
                <Calculate />
            </button>
            <button className='cellOptionButton'
                onClick={ changeCellTypeHandlerFactory('code') }
            >
                <Code />
            </button>
        </div>
        <div className='cellInfo'>
            <span className='cellId'>
                <span className='cellInfoIcon'><Tag /></span>
                <span className='cellInfoText'>{id}</span>
            </span>
        </div>
    </div>

}


function CellIndicatorFocused({ id }: CellIndicatorProps){
    return (
        <div key = { id } id = { id }
            className={ 'cellContentWrapper editingCellWrapper' }
            onClick = { (ev) => {
                ev.stopPropagation()
            }}
        >
            <CellToolbar id = {id} />
            
            <MemoizedCellRenderer id = { id } mode = { RenderMode.EDITOR } />
        </div>
    )
}
function CellIndicatorUnfocused({ id }: CellIndicatorProps){
    const dispatch = useCombinedDispatch()

    return (
        <div key = { id } id = { id }
            className={ 'cellContentWrapper' }
            onClick = { (ev) => {
                ev.stopPropagation()
                dispatch({type:'focus', targetId:id})
            }}
        >
            <CellToolbar id = {id} />

            <MemoizedCellRenderer id = { id } mode = { RenderMode.PREVIEW } />
        </div>
    )
}

function CellIndicator({ id }: CellIndicatorProps){
    const isFocused = useSingleCellFocused(id)

    if(isFocused) return <CellIndicatorFocused id={id} />
    else return <CellIndicatorUnfocused id={id} />
}
const CellPortalScope = CellPortalScopeWith(CellIndicator)


function InterCell({ parentId, idx }: InterCellProps){
    const dispatch = useCombinedDispatch()
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
            </div>
        </div>
    )
}
function ChildrenWrapper({ children }: PropsWithChildren){
    return <div className={'cellChildrenWrapper'} style={ {padding:'0 20px'} }>
        { children }
    </div>
}
const CellPortal = CellPortalWith(InterCell, ChildrenWrapper)

/**
 * Editor core.
 * CombinedStateContext.Provider and CombinedDispatchContext.Provider should be set on the component scope.
 */
export function EditorCore(){
    const rootId = useRootId()
    const dispatch = useCombinedDispatch()

    return (
        <div className='cellEditorWrapper'
            onClick={() => dispatch({type: 'focus'})}
        >
            <div className='editorTextInput'>
                <div className='titleInput'>
                    <label>제목</label>
                    <input className='title' />
                </div>
                <div className='authorInput'>
                    <label>작성자</label>
                    <input className='author' />
                </div>
            </div>

            <hr />
            <div className='allCellsWrapper'>
                <CellPortalScope>
                    <CellPortal id= {
                        rootId
                    } />
                </CellPortalScope>
            </div>
            <hr />

            <div className='buttonsWrapper'>
                <button>Upload(defunct)</button>
            </div>
        </div>
    )
}