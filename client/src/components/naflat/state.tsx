// action reducer based on react hook reducer.
// for scaling (or switching into redux-based), consider using https://github.com/brietsparks/normalized-reducer-demo.

import React from 'react';
import * as F from './flat';
import { CellType, CellValueType, isChildAllowed, Flat, defaultValue } from './flat';

import katex from 'katex';
import lodash, { cloneDeep } from 'lodash'

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

    //////editor info
    focusId? : string;
    cursorStart? : number; //for text cell purpose
    cursorEnd? : number; //for text cell purpose

    historyBackward : FlatHistoryAction[];
    historyForward : FlatHistoryAction[];
    historyCursor : number;
}

interface FlatHistoryAction {
    id: string;
    subflat: Flat; //the subflat to overwrite.

    // cascadeChildren?: boolean; // if true, cascade flat[id] children before mergeing subflat. also recalculate hideChildren object.
    // relabel?: boolean; //if true, update label objects.

    description: 'update' | 'restructure' | 'cascadeChildren' | 'delete';
}

const historyActionPolicy = {
    'update' : { relabel: false, cascadeChildren: false, delete: false },
    'restructure' : { relabel: true, cascadeChildren: false, delete: false },
    'cascadeChildren' : { relabel: true, cascadeChildren: true, delete: false },
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
        allLabel, typedLabel, hideChildren, mathMacroObj,
        editedTimestamps, contextTimestamp,
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

        flat = {...flat, ...cloneDeep(subflat)};
        // Object.assign(flat, cloneDeep(subflat));

        allLabel = F.generateAllLabel(flat, rootId);
        typedLabel = F.generateTypedLabel(flat, rootId);

        var timestamp = getNonDuplicateTimestamp(contextTimestamp);
        for(var cid in subflat){
            editedTimestamps[cid] = timestamp;
        }
        for(var cid in flat){
            if(isChildAllowed(flat[cid].type)){
                editedTimestamps[cid] = timestamp;
            }
        }
    }
    else{
        flat = {...flat, ...cloneDeep(subflat)};
        // Object.assign(flat, cloneDeep(subflat));

        var timestamp = getNonDuplicateTimestamp(contextTimestamp);
        for(var cid in subflat){
            editedTimestamps[cid] = timestamp;
        }
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

        contextTimestamp = getNonDuplicateTimestamp(contextTimestamp);
    }

    return {
        flat, rootId,
        allLabel, typedLabel, hideChildren, mathMacroObj,
        editedTimestamps, contextTimestamp,
        ...others
    };
}

const reducer : React.Reducer<FlatState, FlatStateAction> = function(state, action){
    let {
        flat, rootId,
        allLabel, typedLabel, hideChildren, mathMacroObj,
        focusId, cursorStart, cursorEnd
    } = state;
    let pos : number | undefined = 0;

    function pushHistory(histBack: FlatHistoryAction, histForw: FlatHistoryAction){
        if(state.historyBackward.length > state.historyCursor){ //clear future
            state.historyBackward = state.historyBackward.slice(0, state.historyCursor);
            state.historyForward = state.historyForward.slice(0, state.historyCursor);
        }

        if(state.historyBackward.length === MAX_HISTORY){ //remove old history
            state.historyBackward.shift();
            state.historyForward.shift();
            state.historyCursor -= 1;
        }
        state.historyBackward.push(histBack);
        state.historyForward.push(histForw);
        state.historyCursor += 1;

        // console.log('back', state.historyBackward);
        // console.log('forw', state.historyForward);
        // console.log(state.historyCursor);
    }

    switch (action.type){
    case 'update':
        pushHistory({
            description: 'update',
            id: action.id,
            subflat: cloneDeep({[action.id]: flat[action.id]})
        }, {
            description: 'update',
            id: action.id,
            subflat: cloneDeep({[action.id]: {...flat[action.id], value: action.value} })
        });

        return reduceHistory(
            { ...state, cursorStart: action.cursorStart, cursorEnd: action.cursorEnd },
            state.historyForward[state.historyCursor - 1]
        );
    case 'changeType':
        pushHistory({
            description: 'restructure',
            id: action.id,
            subflat: cloneDeep({
                [action.id]: flat[action.id],
                ...F.getSubflat(flat, action.id)
            }) //F.getSubflat(flat, action.id) alone should work, but doen't... why???
        }, {
            description: 'cascadeChildren',
            id: action.id,
            subflat: cloneDeep({[action.id]: {...flat[action.id], type: action.cellType, value: defaultValue[action.cellType] as any}}),
        });

        // console.log(flat[action.id].childIds);
        // console.log(state.historyBackward[state.historyCursor - 1]);

        return reduceHistory(
            state,
            state.historyForward[state.historyCursor - 1]
        );
    case 'move':
        var oldParentId = flat[action.id].parentId || defaultRootId;
        var newParentId = action.parentId;

        pos = action.pos;
        if(typeof pos === 'undefined'){
            pos = flat[action.parentId].childIds.length;
        }

        pushHistory({
            description: 'restructure',
            id: action.id,
            subflat: cloneDeep({
                [action.id]: flat[action.id],
                [oldParentId]: flat[oldParentId],
                [newParentId]: flat[newParentId]
            })
        }, {
            description: 'restructure',
            id: action.id,
            subflat: cloneDeep({
                [action.id]: { ...flat[action.id], parentId: newParentId },
                [oldParentId]: {
                    ...flat[oldParentId],
                    childIds: flat[oldParentId].childIds.filter(cId => action.id !== cId)
                },
                [newParentId]: {
                    ...flat[newParentId],
                    childIds: [
                        ...flat[newParentId].childIds.slice(0, pos),
                        action.id,
                        ...flat[newParentId].childIds.slice(pos)
                    ]
                },
            }),
        });

        return reduceHistory(
            state,
            state.historyForward[state.historyCursor - 1]
        );
    case 'createEmpty':
        focusId = F.generateId(flat);
        hideChildren[focusId] = false;

        pos = action.pos;
        if(typeof pos === 'undefined'){
            pos = flat[action.parentId].childIds.length;
        }

        pushHistory({
            description: 'delete',
            id: focusId,
            subflat: cloneDeep({ [action.parentId]: flat[action.parentId] })
        }, {
            description: 'restructure',
            id: focusId,
            subflat: cloneDeep({
                [action.parentId]: {
                    ...flat[action.parentId],
                    childIds: [
                        ...flat[action.parentId].childIds.slice(0, pos),
                        focusId,
                        ...flat[action.parentId].childIds.slice(pos)
                    ]
                },
                [focusId]: {
                    id: focusId,
                    type: action.cellType,
                    value: defaultValue[action.cellType] as any,
                    parentId: action.parentId,
                    childIds: []
                }
            })
        });

        return reduceHistory(
            {...state, focusId, hideChildren},
            state.historyForward[state.historyCursor - 1]
        );
    case 'remove':
        console.log(action.id)
        console.log(flat);

        var parentId = flat[action.id].parentId || defaultRootId;

        pushHistory({
            description: 'restructure',
            id: action.id,
            subflat: cloneDeep({
                [parentId]: flat[parentId],
                [action.id]: flat[action.id],
                ...F.getSubflat(flat, action.id)
            })
        }, {
            description: 'delete',
            id: action.id,
            subflat: cloneDeep({
                [parentId]: {
                    ...flat[parentId],
                    childIds: flat[parentId].childIds.filter(cId => action.id !== cId)
                },
            })
        });

        return reduceHistory(
            state,
            state.historyForward[state.historyCursor - 1]
        );
    
    case 'UNDO':
        if(state.historyCursor === 0) return state;

        state.historyCursor -= 1;

        return reduceHistory(state, state.historyBackward[state.historyCursor]);
    case 'REDO':
        if(state.historyCursor === state.historyForward.length) return state;

        state.historyCursor += 1;

        return reduceHistory(state, state.historyForward[state.historyCursor - 1]);

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

    // return {
    //     flat, rootId,
    //     allLabel, typedLabel, hideChildren, mathMacroObj,
    //     focusId, cursorStart, cursorEnd, historyBackward, historyForward, historyCursor
    // };
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

        editedTimestamps: {},
        contextTimestamp: 0,

        allLabel: F.generateAllLabel(flat, rootId),
        typedLabel: F.generateTypedLabel(flat, rootId),
        hideChildren: hideChildren,
        mathMacroObj: macroPass,

        focusId: initialFocusId,
        historyBackward: [],
        historyForward: [],
        historyCursor: 0
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