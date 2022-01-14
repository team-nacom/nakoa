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
    history : Flat[];
}

interface UpdateCellAction {
    type : 'update';
    id : string;
    value : unknown;
}

interface ChangeCellTypeAction {
    type : 'changeType';
    id : string;
    cellType : CellType;
}

interface MoveCellAction{
    type : 'move';
    id : string;
    parentId : string;
    pos? : number;
}

interface CreateEmptyCellAction {
    type : 'createEmpty';
    parentId : string;
    cellType : CellType;
    pos? : number;
}

interface RemoveCellAction{
    type : 'remove';
    id : string;
}

interface FocusAction{
    type : 'focus';
    id : string;
}

interface BlurAction{
    type : 'blur';
}

type FlatStateAction
    = UpdateCellAction
    | ChangeCellTypeAction
    | MoveCellAction
    | CreateEmptyCellAction
    | RemoveCellAction

    | FocusAction
    | BlurAction
;

const reducer : React.Reducer<FlatState, FlatStateAction> = function(state, action){
    let { flat, focusId, history } = state;

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
    case 'blur':
        focusId = undefined;
        break;
    }
    
    // console.log( Object.keys(flat), focusId );

    return { flat, focusId, history };
}

export type { FlatState, FlatStateAction };
export { reducer };