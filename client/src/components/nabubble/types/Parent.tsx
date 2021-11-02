import React, { useRef, MutableRefObject } from 'react';
import { BubbleComponentProps, EditorBubbleComponentProps } from '../componentProps';

import { RenderedTextBubble, EditorTextBubble } from './Text';

//bubble type : 'parent'

function RenderedParentBubble(props : BubbleComponentProps){
    const childrenId = props.bubbleObj.record[props.bubbleId].childrenId || [];

    return (<div style = { { padding:'5px', border:'1px solid black' } }>
        { childrenId.map((childId)=>(
            <RenderedBubble bubbleObj = { props.bubbleObj } bubbleId = { childId } />
        )) }
    </div>)
}

function EditorParentBubble(props : EditorBubbleComponentProps){
    const bid = props.bubbleId
    const childrenId = props.bubbleObj.record[bid].childrenId || [];

    return (<div
        ref = { (el) => { props.refs.current[bid] = el } }
        style = {{ border: '1px solid gray', padding: '0 10px' }}
    >
        { childrenId.map((childId)=>(
            <EditorBubble bubbleObj = { props.bubbleObj } bubbleId = { childId } refs = { props.refs } dispatch = { props.dispatch }/>
        )) }
    </div>)
}

function RenderedBubble(props : BubbleComponentProps){
    switch(props.bubbleObj.record[props.bubbleId].type){
        case 'parent': return (<RenderedParentBubble {...props} />);
        case 'text': return (<RenderedTextBubble {...props} />);
        default: return (<></>);
    }
}

function EditorBubble(props : EditorBubbleComponentProps){
    switch(props.bubbleObj.record[props.bubbleId].type){
        case 'parent': return (<EditorParentBubble {...props} />);
        case 'text': return (<EditorTextBubble {...props} />);
        default: return (<></>);
    }
}

export { RenderedBubble, EditorBubble, RenderedParentBubble, EditorParentBubble };