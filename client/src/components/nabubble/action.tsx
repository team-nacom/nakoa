// https://blog.axlight.com/posts/typescript-aware-react-hooks-for-global-state/

import React from 'react';
import { createStore } from 'react-hooks-global-state';

import { Bubble, Flat } from 'components/nabubble/data';

interface FlatState {
    counter : number;
    flat : Flat;
    previewFlat : Flat;
    autoRender? : boolean;
}

interface FlatInitialize { //initialize bubble and previewBubble
    type: 'init';
    bubble : Bubble;
}

interface FlatPreview {
    type: 'preview';
}

interface FlatPreviewFreeze {
    type: 'previewFreeze';
}

// Flat Manipulation.

interface FlatUpdateAction { //for now, change value only. TODO: change type or children.
    type : 'update';
    id : string;
    label? : string;
    value : unknown;
}

interface FlatAddAction {
    type : 'add';
    parentId : string;
    idx? : number;
    bubble : Bubble;
}

interface FlatDeleteAction{
    type : 'delete';
    id : string;
}

type BubbleSubAction = FlatInitialize | FlatPreview | FlatPreviewFreeze;
type BubbleAction = FlatUpdateAction | FlatAddAction | FlatDeleteAction;

export type { FlatState as BubbleState, BubbleSubAction, BubbleAction };