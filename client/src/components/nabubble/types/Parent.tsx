import * as React from 'react';
import { useGlobalState, dispatch } from '../StateReducer';
import { RenderedTextBubble, EditorTextBubble } from './Text';

interface BubbleComponentProps extends React.HTMLAttributes<HTMLElement>{
    bubbleId : string
}

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

function EditorParentBubble(props : BubbleComponentProps){
    const [ bubble ] = useGlobalState('bubble');
    const childrenId = bubble.record[props.bubbleId].childrenId || [];

    return (<div style = {{ border: '1px solid gray', padding: '0 10px' }}>
        { childrenId.map((childId)=>(
            <EditorBubble bubbleId = { childId }/>
        )) }
    </div>)
}

function RenderedBubble(props : BubbleComponentProps){
    const [ bubble ] = useGlobalState('bubble');

    switch(bubble.record[props.bubbleId].type){
        case 'parent':
            return (<RenderedParentBubble bubbleId = { props.bubbleId } />);
        case 'text':
            return (<RenderedTextBubble bubbleId = { props.bubbleId } />)
        //     break;
        default:
            return (<></>);
    }
}

function EditorBubble(props : BubbleComponentProps){
    const [ bubble ] = useGlobalState('bubble');

    switch(bubble.record[props.bubbleId].type){
        case 'parent':
            return (<EditorParentBubble bubbleId = { props.bubbleId } />);
        case 'text':
            return (<EditorTextBubble bubbleId = { props.bubbleId } />);
        //     break;
        default:
            return (<></>);
    }
}

export { RenderedBubble, EditorBubble, RenderedParentBubble, EditorParentBubble };