import React, { useRef, MutableRefObject } from 'react';
import { BubbleComponentProps, EditorBubbleComponentProps } from '../componentProps';

import { bubbleType, bubbleMap } from './declaration';
import { RenderedTextBubble, PreviewTextBubble, EditorTextBubble } from './Text';

import { useNaBubbleState } from '../actionReducer';

function RenderedParentBubble(props : BubbleComponentProps){
    const { bubbleId, ...others } = props;

    const [ bubble ] = useNaBubbleState('bubble');
    const childrenId = bubble.record[bubbleId].childrenId || [];

    return (<div style = { { padding:'5px', border:'1px solid black' } }>
        { childrenId.map((childId)=>(
            <RenderedBubble {...others} bubbleId = { childId } bubbleType = { bubble.record[childId].type } />
        )) }
    </div>);
}

function PreviewParentBubble(props : BubbleComponentProps){
    const { bubbleId, ...others } = props;

    const [ bubble ] = useNaBubbleState('previewBubble');
    const childrenId = bubble.record[bubbleId].childrenId || [];

    return (<div style = { { padding:'5px', border:'1px solid black' } }>
        { childrenId.map((childId)=>(
            <PreviewBubble {...others} bubbleId = { childId } bubbleType = { bubble.record[childId].type } />
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
            <EditorBubble {...others} bubbleId = { childId } bubbleType = { bubble.record[childId].type } refs = { refs }/>
        )) }
    </div>);
}

function RenderedRootBubble(props : React.HTMLAttributes<HTMLElement>){
    const [ bubble ] = useNaBubbleState('bubble');
    return (<RenderedParentBubble {...props} bubbleId = { bubble.rootId } bubbleType = 'parent' />);
}

function PreviewRootBubble(props : React.HTMLAttributes<HTMLElement>){
    const [ bubble ] = useNaBubbleState('previewBubble');
    if(!bubble) return (<></>);
    return (<PreviewParentBubble {...props} bubbleId = { bubble.rootId } bubbleType = 'parent' />);
}

function EditorRootBubble(props : React.HTMLAttributes<HTMLElement>){
    const [ bubble ] = useNaBubbleState('bubble');
    return (<EditorParentBubble {...props} bubbleId = { bubble.rootId } bubbleType = 'parent' refs = { useRef({}) } />);
}

//////// general renderers. register renderers when adding a new bubble.

function RenderedBubble(props : BubbleComponentProps){
    // const [ bubble ] = useNaBubbleState('bubble');
    const map : bubbleMap<(props : BubbleComponentProps) => JSX.Element> = {
        parent : RenderedParentBubble,
        text : RenderedTextBubble,
    }
    const RenderedTypedBubble = map[props.bubbleType];
    return <RenderedTypedBubble {...props} />
}

function PreviewBubble(props : BubbleComponentProps){
    // const [ bubble ] = useNaBubbleState('preivewBubble');
    const map : bubbleMap<(props : BubbleComponentProps) => JSX.Element> = {
        parent : PreviewParentBubble,
        text : PreviewTextBubble,
    }
    const PreviewTypedBubble = map[props.bubbleType];
    return <PreviewTypedBubble {...props} />
}

function EditorBubble(props : EditorBubbleComponentProps){
    // const [ bubble ] = useNaBubbleState('bubble');
    const map : bubbleMap<(props : EditorBubbleComponentProps) => JSX.Element> = {
        parent : EditorParentBubble,
        text : EditorTextBubble,
    }
    const EditorTypedBubble = map[props.bubbleType];
    return <EditorTypedBubble {...props} />
}

export {
    RenderedRootBubble, EditorRootBubble, PreviewRootBubble,
    // RenderedBubble, EditorBubble, PreviewBubble
    RenderedParentBubble, EditorParentBubble, PreviewParentBubble
};