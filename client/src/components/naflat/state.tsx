// action reducer based on react hook reducer.
// for scaling (or switching into redux-based), consider using https://github.com/brietsparks/normalized-reducer-demo.

import React from 'react';
import * as F from './flat';
import { CellType, CellValueType, isChildAllowed, Flat, defaultValue } from './flat';

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

    history : FlatHistoryAction[];
}

interface FlatHistoryAction {
    id: string;
    subflat: Flat; //the subflat to overwrite.
    timestamp: number;

    // cascadeChildren?: boolean; // if true, cascade flat[id] children before mergeing subflat. also recalculate hideChildren object.
    // relabel?: boolean; //if true, update label objects.
    // useCellTimestamp?: boolean; //if true, editTimestamp[id] = timestamp is executed.

    description: 'update' | 'changeType' | 'move' | 'create' | 'delete';
}

const historyActionPolicy = {
    'update' : { cascadeChildren: false, relabel: false, useCellTimestamp: true },
    'changeType' : { cascadeChildren: true, relabel: true, useCellTimestamp: true },
    'move' : { cascadeChildren: false, relabel: true, useCellTimestamp: false },
    'create' : { cascadeChildren: false, relabel: true, useCellTimestamp: true },
    'delete' : { cascadeChildren: true, relabel: true, useCellTimestamp: false }
}

type FlatStateAction
    = { type: 'update'; id: string; value: any; cursorStart?: number, cursorEnd?: number }
    | { type: 'changeType'; id: string; cellType: CellType; }
    | { type: 'move'; id: string; parentId: string; pos?: number; }
    | { type: 'createEmpty'; parentId: string; cellType: CellType; pos?: number; }
    | { type: 'remove'; id: string; }

    | { type: 'toggleHideChildren'; id: string; } // only on display mode

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

function reduceHistory(state: FlatState, history: FlatHistoryAction): FlatState{
    let {
        flat, rootId,
        editedTimestamps, contextTimestamp, allLabel, typedLabel, hideChildren, mathMacroObj,
        ...others
    } = state;

    let {
        id, subflat, timestamp, description
    } = history;


    if(historyActionPolicy[description].relabel){
        if(historyActionPolicy[description].cascadeChildren){
            flat = F.cascadeChildren(flat, id);
        }

        flat = {...flat, ...subflat};

        allLabel = F.generateAllLabel(flat, rootId);
        typedLabel = F.generateTypedLabel(flat, rootId);

        contextTimestamp = timestamp;
    }
    else{
        flat = {...flat, ...subflat};
    }

    if(historyActionPolicy[description].useCellTimestamp){
        editedTimestamps = {
            ...editedTimestamps,
            [id]: timestamp || getNonDuplicateTimestamp(editedTimestamps[id])
        };
    }

    // if root cell, and context changed?
    if(id === rootId){
        mathMacroObj = {};
        let mathMacroText = (flat[rootId] as any)?.mathMacro;
        katex.renderToString(mathMacroText,{
            throwOnError: false,
            globalGroup: true,
            macros : mathMacroObj
        }); //render once and discard the result!

        contextTimestamp = editedTimestamps[id];
    }

    return {
        flat, rootId,
        editedTimestamps, contextTimestamp, allLabel, typedLabel, hideChildren, mathMacroObj,
        ...others
    };
}

function reduceMove(state: FlatState, id: string, parentId: string, pos?: number, timestamp?: number): FlatState{
    let {
        flat, rootId,
        editedTimestamps, contextTimestamp, allLabel, typedLabel, hideChildren, mathMacroObj,
        ...others
    } = state;

    flat = F.moveCell(flat, id, parentId, pos);
    allLabel = F.generateAllLabel(flat, rootId);
    typedLabel = F.generateTypedLabel(flat, rootId);
    contextTimestamp = timestamp || getNonDuplicateTimestamp(editedTimestamps[id]);

    return {
        flat, rootId,
        editedTimestamps, contextTimestamp, allLabel, typedLabel, hideChildren, mathMacroObj,
        ...others
    };
}

const reducer : React.Reducer<FlatState, FlatStateAction> = function(state, action){
    let {
        flat, rootId,
        editedTimestamps, contextTimestamp, allLabel, typedLabel, hideChildren, mathMacroObj,
        focusId, cursorStart, cursorEnd, history
    } = state;

    let currentTimestamp = Date.now();

    switch (action.type){
    case 'update':
        state.cursorStart = action.cursorStart;
        state.cursorEnd = action.cursorEnd;

        return reduceHistory(
            state,
            {
                description: 'update',
                id: action.id,
                subflat: {[action.id]: {...state.flat[action.id], value: action.value} },
                timestamp: currentTimestamp
            }
        );
    case 'changeType':
        return reduceHistory(
            state,
            {
                description: 'update',
                id: action.id,
                subflat: {[action.id]: {...state.flat[action.id], type: action.cellType, value: defaultValue[action.cellType] as any}},
                timestamp: currentTimestamp
            }
        );
    case 'move':
        // history
        return reduceHistory(
            state,
            {
                description: 'move',
                id: action.id,
                subflat: {
                    [action.parentId]: {
                        ...state.flat[action.parentId],
                        childIds: [
                            ...state.flat[action.parentId].childIds
                        ]
                    },
                    [action.id]: {
                        ...state.flat[action.id],
                        parentId: action.parentId
                    }
                },
                timestamp: currentTimestamp
            }
        )
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
        return {
            ...state,
            hideChildren: {...hideChildren, [action.id]: !hideChildren[action.id] }
        };

    case 'focus':
        return {...state, focusId: action.id};
    case 'focusAdj':
        return {
            ...state,
            focusId: F.findAdjacentId(flat, focusId, action.direction)
        };
    case 'blur':
        return {...state, focusId: undefined};
    case 'resetCursor':
        return {...state, cursorStart: undefined, cursorEnd: undefined};
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