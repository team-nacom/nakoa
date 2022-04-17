// Implementation of cell (and flat) renderer components.
// This file contains definitions which is only valid AFTER defining render strategies for each types.

import React, { useEffect, useCallback, useMemo, useReducer, createContext, useContext } from 'react';

import { ShortcutProvider, withShortcut, IWithShortcut } from 'etc/react-keybind'; // 'react-keybind';

import lodash from 'lodash';
import {
    CellType, Cell, CellTypeMap, defaultCellType, defaultValue, isChildAllowed,
    Flat
} from './flat';
import {
    FlatState, FlatStateAction,
    reducer, makeInitialState, FlatContext,
    emptyFlat, defaultRootId
} from './state';
import { CellComponentProps, CellRenderStrategy, CachedCellComponentProps, applyCache } from './componentTypes';

import { handleGlobalShortcutFactory } from './strategies/helpers/handlers';



import RootCellStrategy from './strategies/Root';
import SectionCellStrategy from './strategies/Section';
import TextCellStrategy from './strategies/Text';
import MathCellStrategy from './strategies/Math';
import CodeCellStrategy from './strategies/Code';
import ImageCellStrategy from './strategies/Image';

import InterCell from './aux/InterCell';

const maxDepth = 4;

const cachedStrategyMap: CellTypeMap<CellRenderStrategy<CachedCellComponentProps>> = {
    'root': applyCache(RootCellStrategy),
    'section': applyCache(SectionCellStrategy),
    'text': applyCache(TextCellStrategy),
    'math': applyCache(MathCellStrategy),
    'code': applyCache(CodeCellStrategy),
    'image': applyCache(ImageCellStrategy)
};

function CellPublished(props: CellComponentProps) {
    const { state, dispatch } = useContext(FlatContext);
    const cellId = props.cellId;

    const cell = state.flat[cellId];
    const DisplayCached = cachedStrategyMap[cell.type]['display'];

    return <>
        <div className='cellContentWrapper' id={cellId}>
            <DisplayCached //feed cache informations.
                cellId={cellId}
                editedTimestamp={state.editedTimestamps[cellId]}
                contextTimestamp={state.contextTimestamp}
            />
        </div>
        { /* render children. */}
        {isChildAllowed(cell.type) && // open all cells as default.
            <div className={'cellChildrenWrapper'}
                id={cellId}
            >
                {
                    cell.childIds.reduce((prev, childId, idx) => prev.concat(
                        <CellPublished {...props} cellId={childId} />,
                        <div className='interBlockHelper' /> //Just for css.
                    ), [<div className='interBlockHelper' />])
                }
            </div>
        }
    </>;
}

function CellDisplay(props: CellComponentProps) {
    const { state, dispatch } = useContext(FlatContext);
    const cellId = props.cellId;

    const cell = state.flat[cellId];
    const DisplayCached = cachedStrategyMap[cell.type]['display'];

    return <>
        <div className='cellContentWrapper' id={cellId}>
            <DisplayCached //feed cache informations.
                cellId={cellId}
                editedTimestamp={state.editedTimestamps[cellId]}
                contextTimestamp={state.contextTimestamp}
            />
        </div>

        { /* render children. */}
        {isChildAllowed(cell.type) &&
            <div className={'cellChildrenWrapper' + (state.hideChildren[cellId] ? ' childrenContainerHidden' : '')}
                id={cellId}
            >
                {cell.type === 'section' &&
                    <div className='toggleHideChildren'
                        onClick={() => {
                            dispatch({ type: 'toggleHideChildren', id: cellId });
                        }}
                    >
                        {
                            state.hideChildren[cellId]
                                ? '▶' + '펼치기'
                                : '▼' + '접기'
                        }
                    </div>
                }
                {
                    cell.childIds.reduce((prev, childId, idx) => prev.concat(
                        <CellDisplay {...props} cellId={childId} />,
                        <div className='interBlockHelper' /> //Just for css.
                    ), [<div className='interBlockHelper' />])
                }
            </div>
        }
    </>;
}

function CellEditor(props: CellComponentProps) {
    const { state, dispatch } = useContext(FlatContext);
    const cellId = props.cellId;
    const cellLabel = state.typedLabel[cellId];

    const cell = state.flat[cellId];
    const isFocused = (state.focusId === cellId);

    let depth = cellLabel.length;
    let pos = cellLabel.join('.');

    const PreviewCached = cachedStrategyMap[cell.type]['preview'];
    const EditorCached = cachedStrategyMap[cell.type]['editor'];

    function cellTypeButtonHandlerFactory(type: CellType) {
        return () => {
            if (cell.type === type) return;
            if ((
                lodash.isEqual(cell.value, defaultValue[cell.type])
                && !(isChildAllowed(cell.type) && cell.childIds.length > 0)
            )
                || window.confirm('셀 타입을 변경하면 하위 셀이 삭제되며 내용이 초기화됩니다. 정말로 셀 타입을 변경하시겠습니까?')
            ) { //either the value is default OR it is confirmed to reset the value
                dispatch({ type: 'changeType', cellType: type, id: cellId });
            }
        }
    }

    function deleteButtonHandler() {
        if ((
            lodash.isEqual(cell.value, defaultValue[cell.type])
            && !(isChildAllowed(cell.type) && cell.childIds.length > 0)
        )
            || window.confirm('정말로 셀과 하위 셀을 삭제하시겠습니까?')
        ) { //either the value is default OR it is confirmed
            dispatch({ type: 'remove', id: cellId })
        }
    }

    return <>
        {!isFocused &&
            <>
                <div className='cellContentWrapper' id={cellId}
                    onClick={(ev) => {
                        ev.stopPropagation();
                        dispatch({ type: 'focus', id: cellId })
                    }}
                >
                    <div className='cellOptions'>
                        <span className='cellId'>
                            ID: {cellId} |
                        </span>
                        <span className='cellPos'>
                            pos: {pos}
                        </span>
                        {cell.type !== 'root' &&
                            <button
                                className='material-icons cellOptionButton'
                                onClick={deleteButtonHandler}
                            >
                                delete
                            </button>
                        }
                    </div>
                    <PreviewCached //feed cache informations.
                        cellId={cellId}
                        editedTimestamp={state.editedTimestamps[cellId]}
                        contextTimestamp={state.contextTimestamp}
                    />
                </div>
            </>
        }
        {isFocused &&
            <div className='cellContentWrapper editingCellWrapper' id={cellId}
                onClick={(ev) => { ev.stopPropagation() }}
            >
                { /* side cell */}
                <div className='cellOptions'>
                    <span className='cellId'>
                        ID: {cellId} |
                    </span>
                    <span className='cellPos'>
                        pos: {pos}
                    </span>
                    {cell.type !== 'root' &&
                        <>
                            <button
                                className='material-icons cellOptionButton'
                                onClick={cellTypeButtonHandlerFactory('text')}
                            >
                                article
                            </button>
                            <button
                                className='material-icons cellOptionButton'
                                onClick={cellTypeButtonHandlerFactory('math')}
                            >
                                calculate
                            </button>
                            <button
                                className='material-icons cellOptionButton'
                                onClick={cellTypeButtonHandlerFactory('code')}
                            >
                                code
                            </button>
                            <button
                                className='material-icons cellOptionButton'
                                onClick={cellTypeButtonHandlerFactory('image')}
                            >
                                image
                            </button>
                        </>
                    }
                    <button
                        className='material-icons cellOptionButton'
                        onClick={() => dispatch({ type: 'blur' })}
                    >
                        close
                    </button>
                    {cell.type !== 'root' &&
                        <button
                            className='material-icons cellOptionButton'
                            onClick={deleteButtonHandler}
                        >
                            delete
                        </button>
                    }
                </div>

                <EditorCached //feed cache informations.
                    cellId={cellId}
                    editedTimestamp={state.editedTimestamps[cellId]}
                    contextTimestamp={state.contextTimestamp}
                />
            </div>
        }

        { /* render children. */}
        {isChildAllowed(cell.type) && depth <= maxDepth &&
            <div className={'cellChildrenWrapper' + (state.hideChildren[cellId] ? ' childrenContainerHiddenEditor' : '')}
                // style={{ border: '1px solid gray', padding: '0 60px' }}
                onClick={() => dispatch({ type: 'blur' })}
            >
                {
                    cell.childIds.reduce((prev, childId, idx) => prev.concat(
                        <CellEditor {...props} cellId={childId} />,
                        <InterCell parentId={cellId} pos={idx + 1} depth={depth}/>
                    ), [<InterCell parentId={cellId} pos={0} depth={depth}/>])
                }
            </div>
        }
    </>;
}

interface FlatComponentProps extends CellComponentProps {
    // id: string // rootId.
    initialFlat?: Flat;
    initialFocusId?: string;
}

// published component implementation
function FlatPublishedComponent(props: FlatComponentProps) {
    const { initialFlat, initialFocusId, ...others } = props;

    const [state, dispatch] = useReducer(
        reducer,
        makeInitialState(
            initialFlat || emptyFlat,
            props.cellId,
            initialFocusId
        )
    );

    return ( //implement display here
        <FlatContext.Provider value={{ state, dispatch }} >
            <div className='allCellsWrapper'>
                <CellPublished {...others} />
            </div>
        </FlatContext.Provider>
    );
}

// display component implementation
function FlatDisplayComponent(props: FlatComponentProps) {
    const { initialFlat, initialFocusId, ...others } = props;

    const [state, dispatch] = useReducer(
        reducer,
        makeInitialState(
            initialFlat || emptyFlat,
            props.cellId,
            initialFocusId
        )
    );

    return ( //implement display here
        <FlatContext.Provider value={{ state, dispatch }} >
            <div className='allCellsWrapper'>
                <CellDisplay {...others} />
            </div>
        </FlatContext.Provider>
    );
}


// editor component implementation
// DO NOT INHERIT THIS COMPONENT: if there are some metadata, rewrite the entire component based on this simple implementation.
function FlatEditorComponent(props: FlatComponentProps) {
    const { initialFlat, initialFocusId, ...others } = props;

    const [state, dispatch] = useReducer(
        reducer,
        makeInitialState(
            initialFlat || emptyFlat,
            props.cellId,
            initialFocusId
        )
    );

    return (<FlatContext.Provider value={{ state, dispatch }} >
        <div className='allCellsWrapper'>
            <CellEditor {...others} /> { /* root cell */}
        </div>
    </FlatContext.Provider>);
}

export type { CellComponentProps, FlatComponentProps, CellRenderStrategy };
export { CellPublished, CellDisplay, CellEditor };
export { FlatPublishedComponent, FlatDisplayComponent, FlatEditorComponent };
export { maxDepth };