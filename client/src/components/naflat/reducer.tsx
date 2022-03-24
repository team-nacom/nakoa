// action reducer based on react hook reducer.
// for scaling (or switching into redux-based), consider using https://github.com/brietsparks/normalized-reducer-demo.

import React from 'react';
import * as F from './flat';
import { CellType, Flat } from './flat';

import { RenderInfo, autoLabel } from './renderInfo';

const MAX_HISTORY = 5;

interface FlatState{
    flat : Flat;
    rootId : string;
    renderInfo : RenderInfo;
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

    | { type: 'focus'; id: string; }
    | { type: 'focusAdj'; direction: number; }
    | { type: 'blur'; }
    | { type: 'resetCursor'; }

    | { type: 'updateMacro', mathMacro?: Object, textMacro?: Object }
;

const reducer : React.Reducer<FlatState, FlatStateAction> = function(state, action){
    let { flat, rootId, renderInfo, focusId, cursorStart, cursorEnd, history } = state;

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
        cursorStart = action.cursorStart;
        cursorEnd = action.cursorEnd;
        break; //not saved in history
    case 'changeType':
        flat = F.changeCellType(flat, action.id, action.cellType);
        renderInfo.label = autoLabel(flat, rootId, renderInfo.label);
        // if(state.flat !== flat) pushHistory(state.flat);
        break;
    case 'move':
        flat = F.moveCell(flat,action.id,action.parentId,action.pos);
        renderInfo.label = autoLabel(flat, rootId, renderInfo.label);
        // if(state.flat !== flat) pushHistory(state.flat);
        break;
    case 'createEmpty':
        [flat, focusId] = F.createChildCell(flat, action.parentId, action.cellType, action.pos);
        renderInfo.label = autoLabel(flat, rootId, renderInfo.label);
        // if(state.flat !== flat) pushHistory(state.flat);
        break;
    case 'remove':
        flat = F.removeCell(flat, action.id);
        renderInfo.label = autoLabel(flat, rootId, renderInfo.label);
        // if(state.flat !== flat) pushHistory(state.flat);
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

    case 'updateMacro':
        if(action.mathMacro){
            renderInfo.macros.math = action.mathMacro;
        }
        if(action.textMacro){
            renderInfo.macros.text = action.textMacro;
        }
        break;
    }
    
    // console.log( JSON.stringify(flat) );

    return { flat, rootId, renderInfo, focusId, cursorStart, cursorEnd, history };
}

export type { FlatState, FlatStateAction };
export { reducer };