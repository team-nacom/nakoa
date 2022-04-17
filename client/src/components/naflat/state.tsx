// action reducer based on react hook reducer.
// for scaling (or switching into redux-based), consider using https://github.com/brietsparks/normalized-reducer-demo.

import React from 'react';
import * as F from './flat';
import { CellType, CellValueType, isChildAllowed, Flat } from './flat';

import katex from 'katex';

const MAX_HISTORY = 5;

interface FlatState{
    //////basic info
    flat : Flat;
    rootId : string;

    //////context-specific info
    editedTimestamps: Record<string, number>;
    contextTimestamp: number;
    allLabel : Record<string, number[]>;
    typedLabel : Record<string, number[]>;
    hideChildren : Record<string, boolean>;
    mathMacroObj : Object;
    // textMacro: Object;

    //////editor info
    focusId? : string;
    cursorStart? : number; //for text cell purpose
    cursorEnd? : number; //for text cell purpose

    history : Flat[];
}

type FlatStateAction
    = { type: 'update'; id: string; value: unknown; cursorStart?: number, cursorEnd?: number }
    | { type: 'changeType'; id: string; cellType: CellType; }
    | { type: 'move'; id: string; parentId: string; pos?: number; }
    | { type: 'createEmpty'; parentId: string; cellType: CellType; pos?: number; }
    | { type: 'remove'; id: string; }

    | { type: 'toggleHideChildren'; id: string; }
    | { type: 'updateMacro', mathMacroObj: Object }

    | { type: 'focus'; id: string; }
    | { type: 'focusAdj'; direction: number; }
    | { type: 'blur'; }
    | { type: 'resetCursor'; }
;

function getNonDuplicateTimestamp(baseTimestamp: number){
    let now = Date.now();
    while(now <= baseTimestamp){
        now += 0.01; //may have 100 different timestamps in 1ms.
    }
    return now;
}

const reducer : React.Reducer<FlatState, FlatStateAction> = function(state, action){
    let {
        flat, rootId,
        editedTimestamps, contextTimestamp, allLabel, typedLabel, hideChildren, mathMacroObj,
        focusId, cursorStart, cursorEnd, history
    } = state;

    function pushHistory(f : Flat){
        history.push(f);
        if(history.length > MAX_HISTORY){
            history.shift();
        }
    }
    function popHistory(){
        return history.pop();
    }

    switch (action.type){
    case 'update':
        flat = F.updateCell(flat, action.id, action.value);
        
        editedTimestamps = {
            ...editedTimestamps,
            [action.id]: getNonDuplicateTimestamp(editedTimestamps[action.id])
        };

        cursorStart = action.cursorStart;
        cursorEnd = action.cursorEnd;
        break; //not saved in history
    case 'changeType':
        flat = F.changeCellType(flat, action.id, action.cellType);
        allLabel = F.generateAllLabel(flat, rootId);
        typedLabel = F.generateTypedLabel(flat, rootId);

        editedTimestamps = {
            ...editedTimestamps,
            [action.id]: getNonDuplicateTimestamp(editedTimestamps[action.id])
        };
        contextTimestamp = editedTimestamps[action.id];
        
        // if(state.flat !== flat) pushHistory(state.flat);
        break;
    case 'move':
        flat = F.moveCell(flat,action.id,action.parentId,action.pos);
        allLabel = F.generateAllLabel(flat, rootId);
        typedLabel = F.generateTypedLabel(flat, rootId);

        contextTimestamp = getNonDuplicateTimestamp(contextTimestamp);
        // if(state.flat !== flat) pushHistory(state.flat);
        break;
    case 'createEmpty':
        [flat, focusId] = F.createChildCell(flat, action.parentId, action.cellType, action.pos);
        allLabel = F.generateAllLabel(flat, rootId);
        typedLabel = F.generateTypedLabel(flat, rootId);
        hideChildren = {...hideChildren, [focusId]: false};

        editedTimestamps = {...editedTimestamps, [focusId]: getNonDuplicateTimestamp(0)}
        contextTimestamp = editedTimestamps[focusId];
        // if(state.flat !== flat) pushHistory(state.flat);
        break;
    case 'remove':
        flat = F.removeCell(flat, action.id);
        allLabel = F.generateAllLabel(flat, rootId);
        typedLabel = F.generateTypedLabel(flat, rootId);
        hideChildren = {...hideChildren, [action.id]: false}; //reset show/hide status default to show

        contextTimestamp = getNonDuplicateTimestamp(contextTimestamp);
        // if(state.flat !== flat) pushHistory(state.flat);
        break;
    
    case 'toggleHideChildren':
        hideChildren = {...hideChildren, [action.id]: !hideChildren[action.id] };
        break;

    case 'updateMacro':
        mathMacroObj = action.mathMacroObj;

        contextTimestamp = getNonDuplicateTimestamp(contextTimestamp);
        break;

    case 'focus':
        focusId = action.id;
        break;
    case 'focusAdj':
        focusId = F.findAdjacentId(flat, focusId, action.direction);
        break;
    case 'blur':
        focusId = undefined;
        break;
    case 'resetCursor':
        cursorStart = cursorEnd = undefined;
        break;
    }
    
    // console.log( JSON.stringify(flat) );

    return {
        flat, rootId,
        editedTimestamps, contextTimestamp, allLabel, typedLabel, hideChildren, mathMacroObj,
        focusId, cursorStart, cursorEnd, history
    };
}

// the cell component type should match to the cell type,
// but we won't strictly check that elsewhere.
function makeInitialState(flat: Flat, rootId: string, initialFocusId?: string) : FlatState{
    //fake root rendering
    //TODO : unify 'initial state rendering' and real root state renmdering logic
    let macroPass = {};
    if(rootId){
        var mathMacroText = (flat[rootId]?.value as any)?.mathMacro;
        katex.renderToString(mathMacroText,{
            throwOnError: false,
            globalGroup: true,
            macros : macroPass
        }); //render once and discard the result!
    }

    //mark whether show children or not
    let hideChildren = {} as Record<string,boolean>;
    for(let cell of Object.values(flat)){
        // if(isChildAllowed(cell.type)){
        //     hideChildren[cell.id] = false;
        // }
        if(cell.type === 'section' && cell.value.hideChildren){
            hideChildren[cell.id] = true;
        }
    }

    //initialize timestamps
    let currentTimestamp = Date.now();
    let editedTimestamps = {} as Record<string, number>;
    for(let cellId of Object.keys(flat)){
        editedTimestamps[cellId] = currentTimestamp;
    }

    return {
        flat: flat,
        rootId: rootId,

        editedTimestamps: editedTimestamps,
        contextTimestamp: currentTimestamp,

        allLabel: F.generateAllLabel(flat, rootId),
        typedLabel: F.generateTypedLabel(flat, rootId),
        hideChildren: hideChildren,
        mathMacroObj: macroPass,

        focusId: initialFocusId,
        history: []
    };
}


const defaultRootId = 'c0';
const emptyFlat: Flat = {
    [defaultRootId]: {
        type: 'root',
        id: defaultRootId,
        childIds: [],
        value: F.defaultValue['root']
    }
};

const mockInitialState = makeInitialState(emptyFlat, defaultRootId);
const FlatContext = React.createContext({
    state: mockInitialState,
    dispatch: ( () => mockInitialState  ) as React.Dispatch<FlatStateAction>
});

export type { FlatState, FlatStateAction };
export { reducer, makeInitialState, FlatContext };
export { defaultRootId, emptyFlat }