import React, { useRef, MutableRefObject } from 'react';

import { BubbleType } from './types/declaration'

import { Flat } from './data';
import { BubbleSubAction, BubbleAction } from './action';

interface BubbleComponentProps extends React.HTMLAttributes<HTMLElement>{
    cellId : string;
    // preview? : boolean;

    bubbleType : BubbleType;
}

interface EditorBubbleComponentProps extends BubbleComponentProps{
    refs : MutableRefObject<Record<string,HTMLElement | null>>; // propagate down. should be generated exclusively by root.
}

export type { BubbleComponentProps, EditorBubbleComponentProps };