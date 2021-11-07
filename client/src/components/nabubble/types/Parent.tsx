import React, { useRef, MutableRefObject } from 'react';
import { BubbleComponentProps, EditorBubbleComponentProps } from '../componentProps';

import { BubbleType, BubbleMap } from './declaration';

// WE NEED POLYMORPHISM!!!!!!!!
import { RenderedTextBubble, PreviewTextBubble, EditorTextBubble } from './Text';
import { RenderedMathBubble, PreviewMathBubble, EditorMathBubble } from './Math';
import { RenderedCodeBubble, PreviewCodeBubble, EditorCodeBubble } from './Code';

import { useNaBubbleState } from '../actionReducer';

//type: 'parent'
//value: title
//has children

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
    const map : BubbleMap<(props : BubbleComponentProps) => JSX.Element> = {
        parent : RenderedParentBubble,
        text : RenderedTextBubble,
        math : RenderedMathBubble,
        code : RenderedCodeBubble,
    }
    const RenderedTypedBubble = map[props.bubbleType];
    return <RenderedTypedBubble {...props} />
}

function PreviewBubble(props : BubbleComponentProps){
    // const [ bubble ] = useNaBubbleState('preivewBubble');
    const map : BubbleMap<(props : BubbleComponentProps) => JSX.Element> = {
        parent : PreviewParentBubble,
        text : PreviewTextBubble,
        math : PreviewMathBubble,
        code : PreviewCodeBubble,
    }
    const PreviewTypedBubble = map[props.bubbleType];
    return <PreviewTypedBubble {...props} />
}

function EditorBubble(props : EditorBubbleComponentProps){
    // const [ bubble ] = useNaBubbleState('bubble');
    const map : BubbleMap<(props : EditorBubbleComponentProps) => JSX.Element> = {
        parent : EditorParentBubble,
        text : EditorTextBubble,
        math : EditorMathBubble,
        code : EditorCodeBubble,
    }
    const EditorTypedBubble = map[props.bubbleType];
    return <EditorTypedBubble {...props} />
}

export {
    RenderedRootBubble, EditorRootBubble, PreviewRootBubble,
    // RenderedBubble, EditorBubble, PreviewBubble
    RenderedParentBubble, EditorParentBubble, PreviewParentBubble
};