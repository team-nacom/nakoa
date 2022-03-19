// Implementation of cell (and flat) renderer components.
// This file contains definitions which is only valid AFTER defining render strategies for each types.

import React, { useEffect, useCallback, useMemo, useReducer, createContext, useContext } from 'react';

import { ShortcutProvider, withShortcut, IWithShortcut} from 'etc/react-keybind'; // 'react-keybind';

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
import { CellComponentProps, CellRenderStrategy } from './componentTypes';

import { handleGlobalShortcutFactory } from './strategies/helpers/handlers';



import RootCellStrategy from './strategies/Root';
import SectionCellStrategy from './strategies/Section';
import TextCellStrategy from './strategies/Text';
import MathCellStrategy from './strategies/Math';
import CodeCellStrategy from './strategies/Code';
import ImageCellStrategy from './strategies/Image';

import InterCell from './aux/InterCell';

const cellRenderStrategyMap: CellTypeMap<CellRenderStrategy> = {
    'root': RootCellStrategy,
    'section': SectionCellStrategy,
    'text': TextCellStrategy,
    'math': MathCellStrategy,
    'code': CodeCellStrategy,
    'image': ImageCellStrategy
};

const maxDepth = 4;

function CellDisplay(props: CellComponentProps) {
    const { state, dispatch } = useContext(FlatContext);
    const cellId = props.cellId;

    const cell = state.flat[cellId];
    const Strategy = cellRenderStrategyMap[cell.type]['display'];

    return <div className='cellWrapper' id={ cellId }>
        <Strategy {...props} />
        { /* render children. */}
        { isChildAllowed(cell.type) &&
            <div className='childrenContainer' id={ cellId }>
                {
                    cell.childIds.reduce((prev, childId, idx) => prev.concat(
                        <CellDisplay {...props} cellId={childId} />,
                        <div className='interBlockHelper' /> //Just for css.
                    ), [ <div className='interBlockHelper' /> ])
                }
            </div>
        }
    </div>;
}

function CellEditor(props: CellComponentProps) {
    const { state, dispatch } = useContext(FlatContext);
    const cellId = props.cellId;
    const cellLabel = state.typedLabel[cellId];

    const cell = state.flat[cellId];
    const isFocused = (state.focusId === cellId);

    let depth = cellLabel.length;
    let pos = cellLabel.join('.');

    const PreviewStrategy = cellRenderStrategyMap[cell.type]['preview'];
    const EditorStrategy = cellRenderStrategyMap[cell.type]['editor'];

    function cellTypeButtonHandlerFactory(type : CellType){
        return () => {
            if(cell.type === type) return;
            if((
                    lodash.isEqual(cell.value, defaultValue[cell.type])
                    && !(isChildAllowed(cell.type) && cell.childIds.length > 0)
                )
                || window.confirm('셀 타입을 변경하면 하위 셀이 삭제되며 내용이 초기화됩니다. 정말로 셀 타입을 변경하시겠습니까?')
            ){ //either the value is default OR it is confirmed to reset the value
                dispatch({ type: 'changeType', cellType: type, id: cellId });
            }
        }
    }

    function deleteButtonHandler(){
        if((
                lodash.isEqual(cell.value, defaultValue[cell.type])
                && !(isChildAllowed(cell.type) && cell.childIds.length > 0)
            )
            || window.confirm('정말로 셀과 하위 셀을 삭제하시겠습니까?')
        ){ //either the value is default OR it is confirmed
            dispatch({ type: 'remove', id: cellId })
        }
    }

    return <>
        {!isFocused &&
            <>
                <div className='cellWrapper' id={ cellId }
                    onClick={(ev) => {
                        ev.stopPropagation();
                        dispatch({ type: 'focus', id: cellId })
                    }}
                >
                    <div className='bubbleOptions'>
                        <span className='cellId'>
                            ID: { cellId } | 
                        </span>
                        <span className='cellPos'>
                            pos: { pos }
                        </span>
                        {/* {isChildAllowed(cell.type) && depth <= maxDepth && cell.childIds.length === 0 &&
                            <button
                                className='material-icons bubbleOptionButton'
                                onClick = { (e) => { e.stopPropagation(); dispatch({ type: 'createEmpty', parentId: cellId, pos : 0, cellType: defaultCellType}) } }
                            >
                                add
                            </button>
                        } */}
                        {cell.type !== 'root' &&
                            <button
                                className='material-icons bubbleOptionButton'
                                onClick={ deleteButtonHandler }
                            >
                                delete
                            </button>
                        }
                    </div>
                    <PreviewStrategy {...props} />
                </div>
            </>
        }
        {isFocused &&
            <div className='editorCellContainer'>

                <div className='cellWrapper' id={ cellId }
                    onClick={(ev) => {ev.stopPropagation()} }
                >
                    { /* side cell */}
                    <div className='bubbleOptions'>
                        <span className='cellId'>
                            ID: { cellId } | 
                        </span>
                        <span className='cellPos'>
                            pos: { pos }
                        </span>
                        {cell.type !== 'root' &&
                            <>
                                {depth <= maxDepth &&
                                    <button
                                        className='material-icons bubbleOptionButton'
                                        onClick={ cellTypeButtonHandlerFactory('section') }
                                    >
                                        topic
                                    </button>
                                }
                                <button
                                    className='material-icons bubbleOptionButton'
                                    onClick={ cellTypeButtonHandlerFactory('text') }
                                >
                                    article
                                </button>
                                <button
                                    className='material-icons bubbleOptionButton'
                                    onClick={ cellTypeButtonHandlerFactory('math') }
                                >
                                    calculate
                                </button>
                                <button
                                    className='material-icons bubbleOptionButton'
                                    onClick={ cellTypeButtonHandlerFactory('code') }
                                >
                                    code
                                </button>
                                <button
                                    className='material-icons bubbleOptionButton'
                                    onClick={ cellTypeButtonHandlerFactory('image') }
                                >
                                    image
                                </button>
                            </>
                        }
                        <button
                            className='material-icons bubbleOptionButton'
                            onClick={() => dispatch({ type: 'blur' })}
                        >
                            close
                        </button>
                        {cell.type !== 'root' &&
                            <button
                                className='material-icons bubbleOptionButton'
                                onClick={() => dispatch({ type: 'remove', id: cellId })}
                            >
                                delete
                            </button>
                        }
                    </div>

                    <EditorStrategy {...props} />
                </div>
            </div>
        }

        { /* render children. */}
        { isChildAllowed(cell.type) && depth <= maxDepth &&
            <div className='childrenContainer'
                // style={{ border: '1px solid gray', padding: '0 60px' }}
                onClick={() => dispatch({ type: 'blur' }) }
            >
                {
                    cell.childIds.reduce((prev, childId, idx) => prev.concat(
                        <CellEditor {...props} cellId={childId} />,
                        <InterCell parentId={cellId} pos={idx + 1} />
                    ), [ <InterCell parentId={cellId} pos={0} /> ])
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
            <CellDisplay {...others} />
        </FlatContext.Provider>
    );
}


// editor component implementation
// DO NOT INHERIT THIS COMPONENT: if there are some metadata, rewrite the entire component based on this simple implementation.
function FlatEditorComponent(props: FlatComponentProps){
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
        <CellEditor {...others}/> { /* root cell */ }
    </FlatContext.Provider>);
}

export type { CellComponentProps, FlatComponentProps, CellRenderStrategy };
export { CellDisplay, CellEditor };
export { FlatDisplayComponent, FlatEditorComponent };