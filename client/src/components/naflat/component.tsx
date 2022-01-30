// Implementation of cell (and flat) renderer components.
// This file contains definitions which is only valid AFTER defining render strategies for each types.

import React from 'react';
import { createContext, useContext } from 'react';

import { CellType, Cell, CellTypeMap, Flat, defaultCellType } from './flat';
import { FlatState, FlatStateAction, reducer } from './reducer';
import { CellComponentProps, CellRenderStrategy, FlatContext, makeInitialState } from './componentTypes';

import RootCellStrategy from './strategies/Root';
import TextCellStrategy from './strategies/Text';
import MathCellStrategy from './strategies/Math';
import CodeCellStrategy from './strategies/Code';

import InterCell from './aux/InterCell';

const cellRenderStrategyMap: CellTypeMap<CellRenderStrategy> = {
    'root': RootCellStrategy,
    'text': TextCellStrategy,
    'math': MathCellStrategy,
    'code': CodeCellStrategy,
};

function CellDisplay(props: CellComponentProps) {
    const { state, dispatch } = useContext(FlatContext);

    const cell = state.flat[props.cellId];
    const Strategy = cellRenderStrategyMap[cell.type]['display'];

    return <>
        <Strategy {...props} />
        { /* render children. */}
        {(cell.type === 'root' || cell.childIds.length !== 0) &&
            <div style={{ border: '1px solid gray', padding: '0 60px' }}>
                {
                    cell.childIds.reduce((prev, childId, idx) => prev.concat(
                        <CellDisplay {...props} cellId={childId} />,
                        <div className='interBlockHelper' /> //Just for css.
                    ), [ <div className='interBlockHelper' /> ])
                }
            </div>
        }
    </>;
}

function CellEditor(props: CellComponentProps) {
    const { state, dispatch } = useContext(FlatContext);

    const cell = state.flat[props.cellId];
    const isFocused = (state.focusId === props.cellId);

    const PreviewStrategy = cellRenderStrategyMap[cell.type]['preview'];
    const EditorStrategy = cellRenderStrategyMap[cell.type]['editor'];

    return <>
        {!isFocused &&
            <>
                { /* side cell */}

                <div className='cellWrapper'
                    onClick={(ev) => {ev.stopPropagation();dispatch({ type: 'focus', id: props.cellId })} }
                >
                    <div className='bubbleOptions'>
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

                <div className='cellWrapper' style={ {display: 'flex'} }
                    onClick={(ev) => {ev.stopPropagation()} }
                >
                    { /* side cell */}
                    <div className='bubbleOptions'>
                        {cell.type !== 'root' &&
                            <>
                                <button
                                    className='material-icons bubbleOptionButton'
                                    onClick={() => dispatch({ type: 'changeType', cellType: 'text', id: props.cellId })}
                                >
                                    article
                                </button>
                                <button
                                    className='material-icons bubbleOptionButton'
                                    onClick={() => dispatch({ type: 'changeType', cellType: 'math', id: props.cellId })}
                                >
                                    calculate
                                </button>
                                <button
                                    className='material-icons bubbleOptionButton'
                                    onClick={() => dispatch({ type: 'changeType', cellType: 'code', id: props.cellId })}
                                >
                                    code
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

                    <span style={{ flex: '50% 0 0' }}>
                        <EditorStrategy {...props} />
                    </span>
                    <span style={{ flex: '50% 0 0' }}>
                        <PreviewStrategy {...props} />
                    </span>
                </div>
            </div>
        }

        { /* render children. */}
        {(cell.type === 'root' || cell.childIds.length !== 0) &&
            <div style={{ border: '1px solid gray', padding: '0 60px' }}
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


interface FlatComponentProps extends CellComponentProps {
    initialFlat?: Flat;
    initialFocusId?: string;
    editMode?: boolean;
}

function FlatComponent(props: FlatComponentProps) {
    let { initialFlat, initialFocusId, editMode, ...others } = props;

    const emptyFlat: Flat = {
        'c0': {
            type: 'root',
            id: 'c0',
            childIds: [],
            value: ''
        }
    };

    const [state, dispatch] = React.useReducer(reducer, makeInitialState(props.initialFlat || emptyFlat, initialFocusId));

    return ( //implement display / editor here
        <FlatContext.Provider value={{ state, dispatch }} >
            {!editMode &&
                <CellDisplay {...others} />
            }
            {editMode &&
                <>
                    <CellEditor {...others} />
                    <button onClick = { () => { console.log(state.flat) } }>console.log 남기기</button>
                </>
            }
        </FlatContext.Provider>
    )
}

export { FlatContext, FlatComponent };