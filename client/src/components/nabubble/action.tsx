// https://blog.axlight.com/posts/typescript-aware-react-hooks-for-global-state/

import React from 'react';
import { createStore } from 'react-hooks-global-state';

import { Bubble, FlatBubble } from 'components/nabubble/data';

interface BubbleState {
    counter : number;
    bubble : FlatBubble;
    bubblePreview? : FlatBubble;
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

interface BubbleDeleteAction{
    type : 'delete';
    id : string;
}

type BubbleAction = BubbleUpdateAction | BubbleAddAction | BubbleDeleteAction;

export type { BubbleState, BubbleAction };