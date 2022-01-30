
// Declaration of cell renderer components.
// This file contains definitions which should be defined BEFORE defining render strategies for each types.

import { Dispatch } from 'react';
import { createContext, useContext } from 'react';

import { Flat } from './flat';
import { FlatState, FlatStateAction } from './reducer';

interface CellComponentProps extends React.HTMLAttributes<HTMLElement>{
    cellId : string;
}
type CellComponent = (props: CellComponentProps) => JSX.Element

type CellRenderStrategy = {
    'display' : CellComponent;
    'preview' : CellComponent;
    'editor' : CellComponent;
}

// the cell component type should match to the cell type,
// but we won't strictly check that elsewhere.

function makeInitialState(flat: Flat, initialFocusId?: string) : FlatState{
    return { flat : flat, focusId : initialFocusId, history : [] };
}

const mockInitialState = makeInitialState({});
const FlatContext = createContext({
    state: mockInitialState,
    dispatch: ( () => mockInitialState  ) as React.Dispatch<FlatStateAction>
});

export type { CellComponentProps, CellRenderStrategy };
export { FlatContext, makeInitialState };