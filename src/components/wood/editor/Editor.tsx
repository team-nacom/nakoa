import { useCallback, memo } from 'react'

import {
    useCombinedDispatch,
    useSingleCell, useSingleCellType, useSingleCellFocused, useSingleCellChildren, useSingleCellHideChildren, useSingleCellLabelTypewise,
    useRootId, useMetaData, 
} from '#/components/wood/states'

import {
    MemoizedCellRenderer, RenderMode,
    Cell, CellType, cellTypeStr,
    defaultFields, isParentType, labelType
} from '#/components/wood/cell'

import {
    CellPortalScopeWith, CellIndicatorProps,
    CellPortalWith, InterCellProps, ChildrenWrapperProps
} from './CellPortal'

import isEqual from 'react-fast-compare'

import {
    AddBox, ArrowDropDown, ListAlt, FormatListNumberedRtl,
    Article, Calculate, Code, Close, Delete, Image, Tag, Update
} from '@mui/icons-material'

const maxDepth = 5

function CellLabel({ id }: CellIndicatorProps){
    const cell = useSingleCell(id)
    const lbl = useSingleCellLabelTypewise(id)
    return <>{ `(${ labelType(cell) }) ${ lbl.join('.') }` }</>
}

function _CellToolbar({ id }: CellIndicatorProps){
    const cell = useSingleCell(id)
    const childIds = useSingleCellChildren(id)
    const hide = useSingleCellHideChildren(id)
    const isFocused = useSingleCellFocused(id)

    const dispatch = useCombinedDispatch()

    const changeCellTypeHandlerFactory = useCallback((targetType: CellType) => (() => {
        const { [cellTypeStr]: cellType, id: _, ...fields } = cell

        if(cellType === targetType) return
        if((
            isEqual(fields, defaultFields[cellType])
            && !((childIds || []).length > 0)
        )
            || window.confirm('셀 타입을 변경하면 하위 셀이 삭제되며 내용이 초기화됩니다. 정말로 변경하시겠습니까?')
        ){
            dispatch({
                type: 'changeType',
                cellType: targetType,
                id
            })
        }
    }), [cell, childIds, id])

    const deleteHandler = useCallback(()=>{
        const { [cellTypeStr]: cellType, id: unused, ...fields } = cell

        if((
            isEqual(fields, defaultFields[cellType])
            && !((childIds || []).length > 0)
        )
            || window.confirm('정말로 셀과 하위 셀을 삭제하시겠습니까?')
        ){
            dispatch({
                type: 'remove',
                targetId: id
            })
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
                    </>}
                </>}
            </>}
            {cellType !== 'root' && <>
                {isFocused &&
                    <button className='cellOptionButton'
                        onClick={ (ev) => {
                            ev.stopPropagation()
                            dispatch({type: 'focus' })
                        } }
                    >
                        <Close />
                    </button>
                }
                {cellType === 'section' && <>
                    <input type='checkbox'
                        id={ 'hide-' + id }
                        defaultChecked={ hide /* cell.hideChildren */ }
                        onClick={ (ev) => {
                            ev.stopPropagation()
                            dispatch({type: 'toggleHideChildren', id: id})
                        } }
                    />
                    <label className='cellOptionButton'
                        htmlFor={ 'hide-' + id }
                        onClick={ (ev) => { ev.stopPropagation() } }
                    >
                        <ArrowDropDown />
                    </label>
                </>}
                <button className='cellOptionButton'
                    onClick={ deleteHandler }
                >
                    <Delete />
                </button>
            </>}
            {cellType === 'root' &&
                <button
                    className='cellOptionButton'
                    onClick={()=>{
                        dispatch({type:'updateRenderData'})
                    }}
                >
                    <Update />
                </button>
            }
        </div>
        <div className='cellInfo'>
            <span className='cellId'>
                <span className='cellInfoIcon'><Tag /></span>
                <span className='cellInfoText'>{id}</span>
            </span>
            <span className='cellPos'>
                <span className='cellInfoIcon'><FormatListNumberedRtl /></span>
                <span className='cellInfoText'><CellLabel id={id} /></span>
            </span>
        </div>
    </div>
}
const CellToolbar = memo(_CellToolbar)

function _CellIndicator({ id }: CellIndicatorProps){
    const isFocused = useSingleCellFocused(id)
    const mode = (isFocused? RenderMode.EDITOR : RenderMode.PREVIEW)

    const dispatch = useCombinedDispatch()

    return (
        <div id = { id }
            className={ 'cellContentWrapper' + (isFocused? ' editingCellWrapper' : '') }
            onClick = { (ev) => {
                ev.stopPropagation()
                !isFocused && dispatch({type:'focus', targetId:id})
            }}
        >
            <CellToolbar id = { id } />
            <MemoizedCellRenderer id = { id } mode = { mode } />
        </div>
    )
}
const CellIndicator = memo(_CellIndicator)

const CellPortalScope = CellPortalScopeWith(CellIndicator)


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
const InterCell = memo(_InterCell)

function ChildrenWrapper({ children, hide }: ChildrenWrapperProps){
    return <div className={'cellChildrenWrapper'+ (hide ? ' childrenContainerHiddenEditor' : '')}>
        { children }
    </div>
}
const CellPortal = CellPortalWith(InterCell, ChildrenWrapper)

function _MetadataInput(){
    const metadata = useMetaData()
    const dispatch = useCombinedDispatch()

    return (
        <>
            <div className='titleInput'>
                <label>제목</label>
                <input className='title'
                    value={ metadata.title }
                    onChange={ (ev)=>{
                        dispatch({
                            type: 'update',
                            id: metadata.id, // rootId
                            title: ev.target.value
                        })
                    } }
                />
            </div>
            <div className='authorInput'>
                <label>작성자</label>
                <input className='author'
                    value={ metadata.author }
                    onChange={ (ev)=>{
                        dispatch({
                            type: 'update',
                            id: metadata.id, // rootId
                            author: ev.target.value
                        })
                    } }
                />
            </div>
        </>
    )
}
const MetadataInput = memo(_MetadataInput)

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
                <MetadataInput />
            </div>

            <hr />
            <div className='allCellsWrapper'>
                <CellPortalScope>
                    <CellPortal key = { 'cell-' + rootId } id={ rootId } />
                </CellPortalScope>
            </div>
            <hr />

            <div className='buttonsWrapper'>
                <button>Upload(defunct)</button>
            </div>
        </div>
    )
}