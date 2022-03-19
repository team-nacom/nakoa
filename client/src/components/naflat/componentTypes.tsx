
// Declaration of cell renderer components.
// This file contains definitions which should be defined BEFORE defining render strategies for each types.

import { Dispatch } from 'react';
import { createContext, useContext } from 'react';

import katex from 'katex';

import { Flat, generateAllLabel, generateTypedLabel } from './flat';
import { FlatState, FlatStateAction } from './state';

interface CellComponentProps{
    className?: string;
    style?: React.CSSProperties;

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
function makeInitialState(flat: Flat, rootId?: string, initialFocusId?: string) : FlatState{
    //fake root rendering
    //TODO : unify 'initial state rendering' and real root state renmdering logic

    rootId = rootId || '';

    let macroPass = {};
    if(rootId){
        var mathMacroText = (flat[rootId]?.value as any)?.mathMacro;
        katex.renderToString(mathMacroText,{
            throwOnError: false,
            globalGroup: true,
            macros : macroPass
        }); //render once and discard the result!
    }

    return {
        flat: flat,
        rootId: rootId || '',
        allLabel: generateAllLabel(flat, rootId),
        typedLabel: generateTypedLabel(flat, rootId),
        mathMacroObj: macroPass,
        focusId: initialFocusId,
        history: []
    };
}

const mockInitialState = makeInitialState({});
const FlatContext = createContext({
    state: mockInitialState,
    dispatch: ( () => mockInitialState  ) as React.Dispatch<FlatStateAction>
});

export type { CellComponentProps, CellRenderStrategy };
export { FlatContext, makeInitialState };