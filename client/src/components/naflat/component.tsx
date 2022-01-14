import React from 'react';
import { createContext, useContext } from 'react';

import { CellType, Cell, CellTypeMap, Flat } from './flat';
import { FlatState, FlatStateAction, reducer } from './reducer';
import { CellComponentProps, CellFragment, CellRenderStrategy } from './componentTypes';

import RootCellStrategy from './strategies/Root';
import TextCellStrategy from './strategies/Text';
import MathCellStrategy from './strategies/Math';
import CodeCellStrategy from './strategies/Code';

import InterCell from './aux/InterCell';

const FlatStateContext = createContext<FlatState | undefined>(undefined);
const FlatStateDispatchContext = createContext<React.Dispatch<FlatStateAction> | undefined>(undefined);


const cellRenderStrategyMap : CellTypeMap<CellRenderStrategy> = {
    'root': RootCellStrategy,
    'text': TextCellStrategy,
    'math': MathCellStrategy,
    'code': CodeCellStrategy,
};

function CellRenderer(props: CellComponentProps){
    const state = useContext(FlatStateContext);
    const dispatch = useContext(FlatStateDispatchContext);
    if(!state || !dispatch){
        throw new Error('Cannot find Flat ContextProvider(state, dispatch)');
    }

    const cell = state.flat[props.cellId];
    const mode = props.editMode ? (
            state.focusId === props.cellId ?
                'edit' : 'preview'
        ) : 'display';

    try{
        const Strategy = cellRenderStrategyMap[cell.type][mode];
        const PreviewStrategy = cellRenderStrategyMap[cell.type]['preview'];

        return <>
            { mode === 'display' &&
                <Strategy {...props}
                    getState = { () => state }
                    dispatch = { dispatch }
                />
            }
            { mode === 'preview' &&
                <>
                    { /* side cell */ }
                    <button onClick = { () => dispatch({ type: 'focus', id: props.cellId }) }> Edit </button>
                    { cell.type !== 'root' &&
                        <button onClick = { () => dispatch({ type: 'remove', id: props.cellId }) }> Delete </button>
                    }

                    <Strategy {...props}
                        getState = { () => state }
                        dispatch = { dispatch }
                    />
                </>
            }
            { mode === 'edit' &&
                <div className='editorCellContainer'>
                    
                    { /* side cell */ }
                    <button onClick = { () => dispatch({ type: 'blur' }) }> Close </button>
                    { cell.type !== 'root' &&
                        <>
                            <button onClick = { () => dispatch({ type: 'remove', id: props.cellId }) }> Delete </button>
                            <button onClick = { () => dispatch({ type: 'changeType', cellType: 'text', id: props.cellId }) }> As Text</button>
                            <button onClick = { () => dispatch({ type: 'changeType', cellType: 'math', id: props.cellId }) }> As Math</button>
                            <button onClick = { () => dispatch({ type: 'changeType', cellType: 'code', id: props.cellId }) }> As Code</button>
                        </>
                    }

                    <Strategy {...props}
                        style={ { width: '50%' } }
                        getState = { () => state }
                        dispatch = { dispatch }
                    />
                    <PreviewStrategy {...props}
                        style={ {width: '50%' } }
                        getState = { () => state }
                        dispatch = { dispatch }
                    />
                </div>
            }
            
            { /* render children. */ }
            { (cell.type === 'root' || cell.childIds.length !== 0) &&
                <div style={{ border: '1px solid gray', padding: '0 60px' }}>
                    {
                        cell.childIds.reduce((prev,childId,idx) => prev.concat(
                            <CellRenderer {...props} cellId = { childId } />,
                            <InterCell
                                parentId = { props.cellId }
                                pos = { idx + 1 }
                                dispatch = { dispatch }
                            />
                        ), [
                            <InterCell
                                parentId = { props.cellId }
                                pos = { 0 }
                                dispatch = { dispatch }
                            />
                        ])
                    }
                </div>
            }
        </>;
    }
    catch(err){ //removed.
        console.log('already removed:'+ props.cellId);

        return <></>;
    }
}


interface FlatComponentProps extends CellComponentProps{
    initialFlat?: Flat
    initialFocusId?: string
}

function FlatRenderer(props: FlatComponentProps){
    let { initialFlat, initialFocusId, ...others } = props;

    const emptyFlat : Flat = {
        'c0' : {
            type: 'root',
            id: 'c0',
            childIds: [],
            value: ''
        }
    };

    const [state, dispatch] = React.useReducer(reducer, {
        flat : props.initialFlat || emptyFlat,
        focusId : initialFocusId,
        history : []
    });

    return (
        <FlatStateContext.Provider value={ state }>
            <FlatStateDispatchContext.Provider value={ dispatch }>
                <CellRenderer {...others} />
            </FlatStateDispatchContext.Provider>
        </FlatStateContext.Provider>
    )   
}

export { FlatRenderer };