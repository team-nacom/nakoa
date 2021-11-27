import { createStore } from 'react-hooks-global-state';

import { Bubble, Flat, prefixFlat, flatten, inflate, deepCopyFlat } from './bubble';
import { FlatState, FlatAction, FlatSubAction } from './action';

const reducer : React.Reducer<FlatState, FlatAction | FlatSubAction> = (state, action) => {
    var newState : FlatState = {
        counter : state.counter,
        flat : {
            rootId : state.flat.rootId,
            record : {...state.flat.record}
        }, //shallow copy (childrenId are not copied yet)
        previewFlat : state.previewFlat,
        autoRender : state.autoRender
    };
    switch (action.type){
        //FlatSubAction : involving previewBubble
        //previewBubble shares ref of bubble until a bubble has been modified
        case 'init':
            newState.previewFlat = newState.flat = flatten(action.bubble);
            return newState;
        case 'preview':
            newState.autoRender = true;
            newState.previewFlat = newState.flat;
            return newState;
        case 'previewFreeze':
            newState.autoRender = false;
            // newState.previewBubble = deepCopyFlat(state.previewBubble);
            newState.previewFlat = flatten(inflate(state.previewFlat));
            return newState;
        
        //FlatAction
        case 'update': //BubbleUpdateAction
            if(typeof action.label !== 'undefined'){
                newState.flat.record[action.id].label = action.label;    
            }
            newState.flat.record[action.id].value = action.value;
            break;
        case 'add': //BubbleAddAction
            var childrenId = newState.flat.record[action.parentId].childrenId;
            if(typeof childrenId === 'undefined'){ //convert this node into parent.
                newState.flat.record[action.parentId] = {
                    id: action.parentId,
                    type: 'parent',
                    parentId: newState.flat.record[action.parentId].parentId,
                    childrenId: []
                };
                childrenId = [];
            }
            else{
                childrenId = [...childrenId]; //copy
            }
            
            var newBubblePrefix = '_A' + String(state.counter);
            var newBubbleRootId = '_A' + String(state.counter) + '_';
            newState.counter++;
            
            if(typeof action.idx === 'undefined' || action.idx >= childrenId.length ){
                // if invalid idx is given
                childrenId = childrenId.concat(newBubbleRootId);
            }
            else{
                childrenId = childrenId.slice(0,action.idx).concat(newBubbleRootId, childrenId.slice(action.idx) );
            }
            newState.flat.record[action.parentId].childrenId = childrenId;

            var fb = prefixFlat(flatten(action.bubble), newBubblePrefix); //root : '_A7_' or similar
            fb.record[fb.rootId].parentId = action.parentId;

            newState.flat.record = {
                ...newState.flat.record,
                ...fb.record
            };
            break;
        case 'delete':
            var parentId = newState.flat.record[action.id].parentId;
            if(typeof parentId !== 'undefined'){
                var childrenId = newState.flat.record[parentId].childrenId;
                if(typeof childrenId !== 'undefined'){
                    // remove the id from children list.
                    newState.flat.record[parentId].childrenId = childrenId.filter( (id) => ( id !== action.id ) );
                }
            }
            //deposit the node.
            var { [action.id] : _, ...newRecord } = newState.flat.record;
            newState.flat.record = newRecord;
            break;
    }
    if(newState.autoRender){
        newState.previewFlat = newState.flat
    }
    return newState;
};

const defaultState : FlatState = {
    counter : 0,
    autoRender : true,
    flat : flatten({
        type: 'parent',
        children : [ {type: 'text', value: ''} ]
    }),
    previewFlat : flatten({
        type: 'parent',
        children : [ {type: 'text', value: ''} ]
    })
};

export const { useGlobalState : useNaBubbleState, getState: getNaBubbleState, dispatch: dispatchNaBubbleState } = createStore(reducer, defaultState);

