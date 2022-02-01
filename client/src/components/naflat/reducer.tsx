// action reducer based on react hook reducer.
// for scaling (or switching into redux-based), consider using https://github.com/brietsparks/normalized-reducer-demo.

import { BlurEventData } from '@yaireo/tagify';
import React from 'react';
import * as F from './flat';
import { CellType, Flat } from './flat';

const MAX_HISTORY = 5;

interface FlatState{
    flat : Flat;
    focusId? : string;
    cursorStart? : number;
    cursorEnd? : number;
    history : Flat[];
}

type FlatStateAction
    = { type: 'update'; id: string; value: unknown; }
    | { type: 'updateSelected'; id: string; start?: number; end?: number; cursorOption: F.CursorOption, func: (str: string) => string; }
    | { type: 'changeType'; id: string; cellType: CellType; }
    | { type: 'move'; id: string; parentId: string; pos?: number; }
    | { type: 'createEmpty'; parentId: string; cellType: CellType; pos?: number; }
    | { type: 'remove'; id: string; }

    | { type: 'focus'; id: string; }
    | { type: 'focusAdj'; direction: number; }
    | { type: 'blur'; }
    | { type: 'resetCursor'; }
;

const reducer : React.Reducer<FlatState, FlatStateAction> = function(state, action){
    let { flat, focusId, cursorStart, cursorEnd, history } = state;

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
        break; //not saved in history
    case 'updateSelected':
        if(action.start !== undefined && action.end !== undefined){
            [flat, cursorStart, cursorEnd] = F.updateSelected(flat, action.id, action.start, action.end, action.cursorOption, action.func);
        }
        else{
            console.log(action.id);
            if(!flat[action.id]) break;
            let len = String(flat[action.id].value).length;
            [flat, cursorStart, cursorEnd] = F.updateSelected(flat, action.id, len, len, action.cursorOption, action.func);
        }
        break;
    case 'changeType':
        flat = F.changeCellType(flat, action.id, action.cellType);
        // if(state.flat !== flat) pushHistory(state.flat);
        break;
    case 'move':
        flat = F.moveCell(flat,action.id,action.parentId,action.pos);
        // if(state.flat !== flat) pushHistory(state.flat);
        break;
    case 'createEmpty':
        [flat, focusId] = F.createChildCell(flat, action.parentId, action.cellType, action.pos);
        // if(state.flat !== flat) pushHistory(state.flat);
        break;
    case 'remove':
        flat = F.removeCell(flat, action.id);
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
    }
    
    // console.log( JSON.stringify(flat) );

    return { flat, focusId, cursorStart, cursorEnd, history };
}

export type { FlatState, FlatStateAction };
export { reducer };