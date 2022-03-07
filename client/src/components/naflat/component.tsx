// Implementation of cell (and flat) renderer components.
// This file contains definitions which is only valid AFTER defining render strategies for each types.

import React, { useEffect, useCallback, useMemo, useReducer, createContext, useContext } from 'react';

import { ShortcutProvider, withShortcut, IWithShortcut} from 'etc/react-keybind'; // 'react-keybind';

import lodash from 'lodash';
import { CellType, Cell, CellTypeMap, Flat, defaultCellType, defaultValue } from './flat';
import { FlatState, FlatStateAction, reducer } from './reducer';
import { CellComponentProps, CellRenderStrategy, FlatContext, makeInitialState } from './componentTypes';

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

function CellDisplay(props: CellComponentProps) {
    const { state, dispatch } = useContext(FlatContext);

    const cell = state.flat[props.cellId];
    const Strategy = cellRenderStrategyMap[cell.type]['display'];

    return <div className='cellWrapper' id={ props.cellId }>
        {/* <span>{ state.renderInfo.label[props.cellId].auto.join('.') }</span> */}
        <Strategy {...props} />
        { /* render children. */}
        {(cell.type === 'root' || cell.childIds.length !== 0) &&
            <div className='childrenContainer' id={ props.cellId }>
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

    const cell = state.flat[props.cellId];
    const isFocused = (state.focusId === props.cellId);

    const PreviewStrategy = cellRenderStrategyMap[cell.type]['preview'];
    const EditorStrategy = cellRenderStrategyMap[cell.type]['editor'];

    function cellTypeButtonHandlerFactory(type : CellType){
        return () => {
            if(cell.type === type) return;
            if(lodash.isEqual(cell.value, defaultValue[cell.type])
                || window.confirm('셀 타입을 변경하면 내용이 초기화됩니다. 변경하시겠습니까?')
            ){ //either the value is default OR it is confirmed to reset the value
                dispatch({ type: 'changeType', cellType: type, id: props.cellId });
            }
        }
    }

    return <>
        {!isFocused &&
            <>
                <div className='cellWrapper' id={ props.cellId }
                    onClick={(ev) => {
                        ev.stopPropagation();
                        dispatch({ type: 'focus', id: props.cellId })
                    }}
                >
                    <div className='bubbleOptions'>
                        <span className='cellId'>
                            ID: { props.cellId }
                        </span>
                        {cell.childIds.length === 0 &&
                            <button
                                className='material-icons bubbleOptionButton'
                                onClick = { (e) => { e.stopPropagation(); dispatch({ type: 'createEmpty', parentId: props.cellId, pos : 0, cellType: defaultCellType}) } }
                            >
                                add
                            </button>
                        }
                        {cell.type !== 'root' &&
                            <button
                                className='material-icons bubbleOptionButton'
                                onClick={() => dispatch({ type: 'remove', id: props.cellId })}
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

                <div className='cellWrapper' id={ props.cellId }
                    onClick={(ev) => {ev.stopPropagation()} }
                >
                    { /* side cell */}
                    <div className='bubbleOptions'>
                        <span className='cellId'>
                            ID: { props.cellId }
                        </span>
                        {cell.type !== 'root' &&
                            <>
                                <button
                                    className='material-icons bubbleOptionButton'
                                    onClick={ cellTypeButtonHandlerFactory('section') }
                                >
                                    topic
                                </button>
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
                                onClick={() => dispatch({ type: 'remove', id: props.cellId })}
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
        {(cell.type === 'root' || cell.childIds.length !== 0) &&
            <div className='childrenContainer'
                // style={{ border: '1px solid gray', padding: '0 60px' }}
                onClick={() => dispatch({ type: 'blur' }) }
            >
                {
                    cell.childIds.reduce((prev, childId, idx) => prev.concat(
                        <CellEditor {...props} cellId={childId} />,
                        <InterCell parentId={props.cellId} pos={idx + 1} />
                    ), [ <InterCell parentId={props.cellId} pos={0} /> ])
                }
            </div>
        }
    </>;
}



const emptyFlat: Flat = {
    'c0': {
        type: 'root',
        id: 'c0',
        childIds: [],
        value: ''
    }
};

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
export { makeInitialState };
export { CellDisplay, CellEditor };
export { FlatContext, FlatDisplayComponent, FlatEditorComponent };