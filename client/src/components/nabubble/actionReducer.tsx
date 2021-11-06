import { createStore } from 'react-hooks-global-state';

import { Bubble, FlatBubble, prefixFlatBubble, flatten, inflate } from './data';
import { BubbleState, BubbleAction, BubbleSubAction } from './action';

const reducer : React.Reducer<BubbleState, BubbleAction | BubbleSubAction> = (state, action) => {
    var newState : BubbleState = {
        counter : state.counter,
        bubble : {
            rootId : state.bubble.rootId,
            record : {...state.bubble.record}
        }, //shallow copy (childrenId are not copied yet)
        previewBubble : state.previewBubble
    };
    // console.log(newState.previewBubble.record);
    console.log(action.type);
    switch (action.type){
        //BubbleSubAction : involving previewBubble
        //previewBubble shares ref of bubble until a bubble has been modified
        case 'init':
            newState.previewBubble = newState.bubble = flatten(action.bubble);
            return newState;
        case 'preview':
            newState.previewBubble = newState.bubble;
            return newState;
        case 'previewFreeze':
            newState.previewBubble = flatten(inflate(newState.bubble));
            return newState;
        //BubbleAction
        case 'update': //BubbleUpdateAction
            if(typeof action.label !== 'undefined'){
                newState.bubble.record[action.id].label = action.label;    
            }
            newState.bubble.record[action.id].value = action.value;

            console.log(inflate(newState.bubble));
            console.log(inflate(newState.previewBubble));

            return newState;
        case 'add': //BubbleAddAction
            var childrenId = newState.bubble.record[action.parentId].childrenId;
            if(typeof childrenId === 'undefined'){ //convert this node into parent.
                newState.bubble.record[action.parentId] = {
                    id: action.parentId,
                    type: 'parent',
                    parentId: newState.bubble.record[action.parentId].parentId,
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
            newState.bubble.record[action.parentId].childrenId = childrenId;

            var fb = prefixFlatBubble(flatten(action.bubble), newBubblePrefix); //root : '_A7_' or similar
            fb.record[fb.rootId].parentId = action.parentId;

            newState.bubble.record = {
                ...newState.bubble.record,
                ...fb.record
            };

            return newState;
        case 'delete':
            var parentId = newState.bubble.record[action.id].parentId;
            if(typeof parentId !== 'undefined'){
                var childrenId = newState.bubble.record[parentId].childrenId;
                if(typeof childrenId !== 'undefined'){
                    // remove the id from children list.
                    newState.bubble.record[parentId].childrenId = childrenId.filter( (id) => ( id !== action.id ) );
                }
            }
            //deposit the node.
            var { [action.id] : _, ...newRecord } = newState.bubble.record;
            newState.bubble.record = newRecord;

            return newState;
    }
};

const defaultState : BubbleState = {
    counter : 0,
    bubble : flatten({
        type: 'parent',
        children : [ {type: 'text', value: ''} ]
    }),
    previewBubble : flatten({
        type: 'parent',
        children : [ {type: 'text', value: ''} ]
    })
};

export const { useGlobalState : useNaBubbleState, getState: getNaBubbleState, dispatch: dispatchNaBubbleState } = createStore(reducer, defaultState);

