import React, { useRef, MutableRefObject } from 'react';
import { BubbleComponentProps, EditorBubbleComponentProps } from '../ComponentProps';
import { useGlobalState, dispatch } from '../StateReducer';

import { RenderedTextBubble, EditorTextBubble } from './Text';

//bubble type : 'parent'

function RenderedParentBubble(props : BubbleComponentProps){
    const [ bubble ] = useGlobalState('bubble');
    const childrenId = bubble.record[props.bubbleId].childrenId || [];

    return (<div>
        { childrenId.map((childId)=>(
            <RenderedBubble bubbleId = { childId }/>
        )) }
    </div>)
}

function EditorParentBubble(props : EditorBubbleComponentProps){
    const [ bubble ] = useGlobalState('bubble');
    const bid = props.bubbleId
    const childrenId = bubble.record[bid].childrenId || [];

    return (<div
        ref = { (el) => { props.refs.current[bid] = el } }
        style = {{ border: '1px solid gray', padding: '0 10px' }}
    >
        { childrenId.map((childId)=>(
            <EditorBubble bubbleId = { childId } refs = { props.refs }/>
        )) }
    </div>)
}

function RenderedBubble(props : BubbleComponentProps){
    const [ bubble ] = useGlobalState('bubble');

    switch(bubble.record[props.bubbleId].type){
        case 'parent':
            return (<RenderedParentBubble {...props} />);
        case 'text':
            return (<RenderedTextBubble {...props} />);
        default:
            return (<></>);
    }
}

function EditorBubble(props : EditorBubbleComponentProps){
    const [ bubble ] = useGlobalState('bubble');

    switch(bubble.record[props.bubbleId].type){
        case 'parent':
            return (<EditorParentBubble {...props} />);
        case 'text':
            return (<EditorTextBubble {...props} />);
        default:
            return (<></>);
    }
}

export { RenderedBubble, EditorBubble, RenderedParentBubble, EditorParentBubble };