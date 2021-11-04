import React, { useRef, MutableRefObject } from 'react';
import { FlatBubble } from './data';
import { BubbleSubAction, BubbleAction } from './action';

interface BubbleComponentProps extends React.HTMLAttributes<HTMLElement>{
    bubbleId : string;
    // preview? : boolean;

    bubbleType : string;
}

interface EditorBubbleComponentProps extends BubbleComponentProps{
    refs : MutableRefObject<Record<string,HTMLElement | null>>; // propagate down. should be generated exclusively by root.
}

export type { BubbleComponentProps, EditorBubbleComponentProps };