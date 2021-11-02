import React, { useRef, MutableRefObject } from 'react';
import { FlatBubble } from './data';
import { BubbleAction } from './action';

interface BubbleComponentProps extends React.HTMLAttributes<HTMLElement>{
    bubbleId : string;
    bubbleObj : FlatBubble; //propagate down. should be initialized at root.
}

interface EditorBubbleComponentProps extends BubbleComponentProps{
    refs : MutableRefObject<Record<string,HTMLElement | null>>; // propagate down. should be generated exclusively by root.
    dispatch : (action: BubbleAction) => BubbleAction;
}

export type { BubbleComponentProps, EditorBubbleComponentProps };