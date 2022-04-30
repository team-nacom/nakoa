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
    allLabel : Record<string, number[]>;
    typedLabel : Record<string, number[]>;
    hideChildren : Record<string, boolean>;
    mathMacroObj : Object;
    // textMacro: Object;

    //////editor info
    focusId? : string;
    cursorStart? : number; //for text cell purpose
    cursorEnd? : number; //for text cell purpose

    historyPast : FlatHistoryAction[];
    historyFuture : FlatHistoryAction[];

}

interface FlatHistoryAction {
    id: string;
    subflat: Flat; //the subflat to overwrite.

    // cascadeChildren?: boolean; // if true, cascade flat[id] children before mergeing subflat. also recalculate hideChildren object.
    // relabel?: boolean; //if true, update label objects.

    description: 'update' | 'changeType' | 'move' | 'create' | 'delete';
}

const historyActionPolicy = {
    'update' : { relabel: false, cascadeChildren: false, delete: false },
    'changeType' : { relabel: true, cascadeChildren: true, delete: false },
    'move' : { relabel: true, cascadeChildren: false, delete: false },
    'create' : { relabel: true, cascadeChildren: false, delete: false },
    'delete' : { relabel: true, cascadeChildren: true, delete: true }
}

type FlatStateAction
    = { type: 'update'; id: string; value: any; cursorStart?: number, cursorEnd?: number }
    | { type: 'changeType'; id: string; cellType: CellType; }
    | { type: 'move'; id: string; parentId: string; pos?: number; }
    | { type: 'createEmpty'; parentId: string; cellType: CellType; pos?: number; }
    | { type: 'remove'; id: string; }

    | { type: 'UNDO'; }
    | { type: 'REDO'; }

    | { type: 'toggleHideChildren'; id: string; } // only on display mode

    | { type: 'focus'; id: string; }
    | { type: 'focusAdj'; direction: number; }
    | { type: 'blur'; }
    | { type: 'resetCursor'; }
;

function reduceHistory(state: FlatState, history: FlatHistoryAction): FlatState{
    let {
        flat, rootId,
        allLabel, typedLabel, hideChildren, mathMacroObj,
        ...others
    } = state;

    let {
        id, subflat, description
    } = history;


    if(historyActionPolicy[description].relabel){
        if(historyActionPolicy[description].cascadeChildren){
            flat = F.cascadeChildren(flat, id);
        }
        if(historyActionPolicy[description].delete){
            delete flat[id];
        }

        flat = {...flat, ...subflat};

        allLabel = F.generateAllLabel(flat, rootId);
        typedLabel = F.generateTypedLabel(flat, rootId);
    }
    else{
        flat = {...flat, ...subflat};
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
    }

    return {
        flat, rootId,
        allLabel, typedLabel, hideChildren, mathMacroObj,
        ...others
    };
}

const reducer : React.Reducer<FlatState, FlatStateAction> = function(state, action){
    let {
        flat, rootId,
        allLabel, typedLabel, hideChildren, mathMacroObj,
        focusId, cursorStart, cursorEnd, historyPast, historyFuture
    } = state;

    function pushHistoryPast(a: FlatHistoryAction){
        if(historyPast.length === MAX_HISTORY){
            historyPast.shift();
        }
        historyPast.push(a);
    }
    function clearHistoryFuture(){
        historyFuture.length = 0;
    }

    switch (action.type){
    case 'update':
        cursorStart = action.cursorStart;
        cursorEnd = action.cursorEnd;

        pushHistoryPast({
            description: 'update',
            id: action.id,
            subflat: {[action.id]: flat[action.id]}
        });
        clearHistoryFuture();

        return reduceHistory(
            state,
            {
                description: 'update',
                id: action.id,
                subflat: {[action.id]: {...flat[action.id], value: action.value} },
            }
        );
    case 'changeType':
        pushHistoryPast({
            description: 'changeType',
            id: action.id,
            subflat: F.getSubflat(flat, action.id)
        });
        clearHistoryFuture();

        return reduceHistory(
            state,
            {
                description: 'changeType',
                id: action.id,
                subflat: {[action.id]: {...flat[action.id], type: action.cellType, value: defaultValue[action.cellType] as any}},
            }
        );
    case 'move':
        var oldParentId = flat[action.id].parentId || defaultRootId;
        var newParentId = action.parentId;

        pushHistoryPast({
            description: 'move',
            id: action.id,
            subflat: {
                [action.id]: flat[action.id],
                [oldParentId]: flat[oldParentId],
                [newParentId]: flat[newParentId]
            }
        });
        clearHistoryFuture();

        return reduceHistory(
            state,
            {
                description: 'move',
                id: action.id,
                subflat: {
                    [action.id]: { ...flat[action.id], parentId: newParentId },
                    [oldParentId]: {
                        ...flat[oldParentId],
                        childIds: flat[oldParentId].childIds.filter(cId => action.id !== cId)
                    },
                    [newParentId]: {
                        ...flat[newParentId],
                        childIds: flat[newParentId].childIds.splice(action.pos || flat[newParentId].childIds.length, 0, action.id)
                    },
                },
            }
        );
    case 'createEmpty':
        focusId = F.generateId(flat);

        pushHistoryPast({
            description: 'delete',
            id: focusId,
            subflat: { [action.parentId]: flat[action.parentId] }
        });
        clearHistoryFuture();

        return reduceHistory(
            {...state, focusId},
            {
                description: 'create',
                id: focusId,
                subflat: {
                    [action.parentId]: {
                        ...flat[action.parentId],
                        childIds: flat[action.parentId].childIds.splice(action.pos || flat[action.parentId].childIds.length, 0, focusId)
                    },
                    [focusId]: {
                        id: focusId,
                        type: action.cellType,
                        value: defaultValue[action.cellType] as any,
                        childIds: []
                    }
                }
            }
        );
    case 'remove':
        var parentId = flat[action.id].parentId || defaultRootId;
        
        pushHistoryPast({
            description: 'create',
            id: action.id,
            subflat: {
                [parentId]: flat[parentId],
                ...F.getSubflat(flat, action.id)
            }
        });
        clearHistoryFuture();

        return reduceHistory(
            {...state, focusId: undefined},
            {
                description: 'delete',
                id: action.id,
                subflat: {
                    [parentId]: {
                        ...flat[parentId],
                        childIds: flat[parentId].childIds.filter(cId => action.id !== cId)
                    },
                }
            }
        );
    
    case 'UNDO':
        var hist = historyPast.pop();
        if(!hist) return state;

        historyFuture.push(hist);
        return reduceHistory(state, hist);
    case 'REDO':
        var hist = historyFuture.pop();
        if(!hist) return state;

        historyPast.push(hist);
        return reduceHistory(state, hist);

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

    return {
        flat, rootId,
        allLabel, typedLabel, hideChildren, mathMacroObj,
        focusId, cursorStart, cursorEnd, historyPast, historyFuture
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

    return {
        flat: flat,
        rootId: rootId,

        allLabel: F.generateAllLabel(flat, rootId),
        typedLabel: F.generateTypedLabel(flat, rootId),
        hideChildren: hideChildren,
        mathMacroObj: macroPass,

        focusId: initialFocusId,
        historyPast: [],
        historyFuture: []
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