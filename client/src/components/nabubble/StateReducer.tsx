// https://blog.axlight.com/posts/typescript-aware-react-hooks-for-global-state/

import React from 'react';
import { createStore } from 'react-hooks-global-state';
// import { Bubble, ParentBubble } from './BubbleComponent';
// import { TextBubble } from './Text';
// import { BubbleEditor } from './BubbleView';

import { Bubble, FlatBubble, prefixFlatBubble, flatten } from './BubbleData';

interface BubbleState {
    counter : number;
    bubble : FlatBubble;
}

interface BubbleUpdateAction { //for now, change value only. TODO: change type or children.
    type : 'update';
    id : string;
    value : unknown;
}

interface BubbleAddAction {
    type : 'add';
    parentId : string;
    idx? : number;
    bubble : Bubble;
}

type BubbleAction = BubbleUpdateAction | BubbleAddAction;

const reducer : React.Reducer<BubbleState,BubbleAction> = (state, action) => {
    var newState : BubbleState = {
        counter : state.counter,
        bubble : {
            rootId : state.bubble.rootId,
            record : {...state.bubble.record}
        } //shallow copy (childrenId are not copied)
    };
    switch (action.type){
        case 'update': //BubbleUpdateAction
            newState.bubble.record[action.id].value = action.value;

            // console.log(newState.bubble.record);

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
    }
};

const defaultState : BubbleState = {
    counter : 0,
    bubble : flatten({
        type : 'parent',
        children : [
            { type: 'text', value: 'WWWWWW' },
            {
                type: 'parent',
                children : [
                    { type: 'text', value: 'ABCDE' },
                    { type: 'text', value: 'FGIJKL' }
                ]
            },
            { type: 'text', value: 'PPPPPP' }
        ]
    })
}

// real defaultState should be:
//
// const defaultState : BubbleState = {
//     counter : 0,
//     bubble : flatten({
//         type: 'parent',
//         children : [ {type: 'text', value: ''} ]
//     })
// };

export const { useGlobalState, getState, dispatch } = createStore(reducer, defaultState);