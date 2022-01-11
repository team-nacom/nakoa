import React from 'react';
import { createContext, useContext } from 'react';

import { CellType, Cell, CellTypeMap, Flat } from './flat';
import { FlatState, FlatStateAction, reducer } from './reducer';
import { CellComponentProps, CellFragment, CellRenderStrategy } from './componentTypes';

import RootStrategy from './cells/Root';
import TextStrategy from './cells/Text';

const FlatStateContext = createContext<FlatState | undefined>(undefined);
const FlatStateDispatchContext = createContext<React.Dispatch<FlatStateAction> | undefined>(undefined);


const cellRenderStrategyMap : CellTypeMap<CellRenderStrategy> = {
    'root': RootStrategy,
    'text': TextStrategy
    // 'math':
    // 'code':
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

    const Strategy = cellRenderStrategyMap[cell.type][mode];

    return <>
        {
            props.editMode &&
            <button onClick = { () => dispatch({ type: 'focus', id: props.cellId }) }> Edit </button>
        }
        <Strategy {...props}
            getState = { () => state }
            dispatch = { dispatch } />
        
        { cell.childIds.length !== 0 &&
            <div style={{ border: '1px solid gray', padding: '0 60px' }}>
                {
                    cell.childIds.reduce((prev,childId,pos) => prev.concat(
                        <CellRenderer {...props} cellId = { childId } />,
                        <></>
                    ), [
                        <></>
                    ])
                }
            </div>
        }
    </>;
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