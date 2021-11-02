import React, { useRef, MutableRefObject } from 'react';
import { BubbleComponentProps, EditorBubbleComponentProps } from '../componentProps';

import { RenderedTextBubble, PreviewTextBubble, EditorTextBubble } from './Text';

import { useNaBubbleState } from '../actionReducer';

//bubble type : 'parent'

function RenderedParentBubble(props : BubbleComponentProps){
    const { bubbleId, ...others } = props;

    const [ bubble ] = useNaBubbleState('bubble');
    const childrenId = bubble.record[bubbleId].childrenId || [];

    return (<div style = { { padding:'5px', border:'1px solid black' } }>
        { childrenId.map((childId)=>(
            <RenderedBubble {...others} bubbleId = { childId } />
        )) }
    </div>);
}

function PreviewParentBubble(props : BubbleComponentProps){
    const { bubbleId, ...others } = props;

    const [ bubble ] = useNaBubbleState('previewBubble');
    const childrenId = bubble.record[bubbleId].childrenId || [];

    return (<div style = { { padding:'5px', border:'1px solid black' } }>
        { childrenId.map((childId)=>(
            <PreviewBubble {...others} bubbleId = { childId } />
        )) }
    </div>);
}

function EditorParentBubble(props : EditorBubbleComponentProps){
    const { bubbleId, refs, ...others } = props;

    const [ bubble ] = useNaBubbleState('bubble');
    const childrenId = bubble.record[bubbleId].childrenId || [];

    return (<div
        ref = { (el) => { refs.current[bubbleId] = el } }
        style = {{ border: '1px solid gray', padding: '0 10px' }}
    >
        { childrenId.map((childId)=>(
            <EditorBubble {...others} bubbleId = { childId } refs = { refs }/>
        )) }
    </div>);
}

function RenderedRootBubble(props : React.HTMLAttributes<HTMLElement>){
    const [ bubble ] = useNaBubbleState('bubble');
    return (<RenderedParentBubble {...props} bubbleId = { bubble.rootId } />);
}

function PreviewRootBubble(props : React.HTMLAttributes<HTMLElement>){
    const [ bubble ] = useNaBubbleState('previewBubble');
    if(!bubble) return (<></>);
    return (<PreviewParentBubble {...props} bubbleId = { bubble.rootId } />);
}

function EditorRootBubble(props : React.HTMLAttributes<HTMLElement>){
    const [ bubble ] = useNaBubbleState('bubble');
    return (<EditorParentBubble {...props} bubbleId = { bubble.rootId } refs = { useRef({}) } />);
}

function RenderedBubble(props : BubbleComponentProps){
    const [ bubble ] = useNaBubbleState('bubble');
    switch(bubble.record[props.bubbleId].type){
        case 'parent': return (<RenderedParentBubble {...props} />);
        case 'text': return (<RenderedTextBubble {...props} />);
        default: return (<></>);
    }
}

function PreviewBubble(props : BubbleComponentProps){
    const [ bubble ] = useNaBubbleState('previewBubble');
    // console.log(bubble.record, props.bubbleId);
    switch(bubble.record[props.bubbleId].type){
        case 'parent': return (<PreviewParentBubble {...props} />);
        case 'text': return (<PreviewTextBubble {...props} />);
        default: return (<></>);
    }
}

function EditorBubble(props : EditorBubbleComponentProps){
    const [ bubble ] = useNaBubbleState('bubble');
    switch(bubble.record[props.bubbleId].type){
        case 'parent': return (<EditorParentBubble {...props} />);
        case 'text': return (<EditorTextBubble {...props} />);
        default: return (<></>);
    }
}

export {
    RenderedRootBubble, EditorRootBubble, PreviewRootBubble,
    // RenderedBubble, EditorBubble, PreviewBubble
    RenderedParentBubble, EditorParentBubble, PreviewParentBubble
};