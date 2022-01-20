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

function CellRenderer(props: CellComponentProps) {
    const { state, dispatch } = useContext(FlatContext);

    const cell = state.flat[props.cellId];
    const mode = props.editMode ? (
        state.focusId === props.cellId ?
            'editor' : 'preview'
    ) : 'display';

    try {
        const Strategy = cellRenderStrategyMap[cell.type][mode];
        const PreviewStrategy = cellRenderStrategyMap[cell.type]['preview'];

        return <>
            {mode === 'display' &&
                <Strategy {...props} />
            }
            {mode === 'preview' &&
                <>
                    { /* side cell */}

                    <div className='cellWrapper' onClick={() => dispatch({ type: 'focus', id: props.cellId })}>
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
                        <Strategy {...props} />
                    </div>
                </>
            }
            {mode === 'editor' &&
                <div className='editorCellContainer'>

                    <div className='cellWrapper' style={{ display: 'flex' }} >
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
                                    <button
                                        className='material-icons bubbleOptionButton'
                                        onClick={() => dispatch({ type: 'remove', id: props.cellId })}
                                    >
                                        delete
                                    </button>
                                </>
                            }
                            <button
                                className='material-icons bubbleOptionButton'
                                onClick={() => dispatch({ type: 'blur' })}
                            >
                                close
                            </button>
                        </div>

                        <span style={{ flex: '50% 0 0' }}>
                            <Strategy {...props} />
                        </span>
                        <span style={{ flex: '50% 0 0' }}>
                            <PreviewStrategy {...props} />
                        </span>
                    </div>
                </div>
            }

            { /* render children. */}
            {(cell.type === 'root' || cell.childIds.length !== 0) &&
                <div style={{ border: '1px solid gray', padding: '0 60px' }}>
                    {
                        cell.childIds.reduce((prev, childId, idx) => prev.concat(
                            <CellRenderer {...props} cellId={childId} />,
                            <InterCell
                                parentId={props.cellId}
                                pos={idx + 1}
                            />
                        ), [
                            <InterCell
                                parentId={props.cellId}
                                pos={0}
                            />
                        ])
                    }
                </div>
            }
        </>;
    }
    catch (err) { //removed.
        console.log('already removed:' + props.cellId);

        return <></>;
    }
}


interface FlatComponentProps extends CellComponentProps {
    initialFlat?: Flat
    initialFocusId?: string
}

function FlatComponent(props: FlatComponentProps) {
    let { initialFlat, initialFocusId, ...others } = props;

    const emptyFlat: Flat = {
        'c0': {
            type: 'root',
            id: 'c0',
            childIds: [],
            value: ''
        }
    };

    const [state, dispatch] = React.useReducer(reducer, makeInitialState(props.initialFlat || emptyFlat, initialFocusId));

    return (
        <FlatContext.Provider value={{ state, dispatch }} >
            <CellRenderer {...others} />
        </FlatContext.Provider>
    )
}

export { FlatContext, FlatComponent };