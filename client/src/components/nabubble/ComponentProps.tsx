import React, { useRef, MutableRefObject } from 'react';

interface BubbleComponentProps extends React.HTMLAttributes<HTMLElement>{
    bubbleId : string;
}

interface EditorBubbleComponentProps extends BubbleComponentProps{
    refs : MutableRefObject<Record<string,HTMLElement | null>>; // propagate down. should be generated exclusively by root.
}

export type { BubbleComponentProps, EditorBubbleComponentProps };