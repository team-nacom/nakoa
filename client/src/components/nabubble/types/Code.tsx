import React, { useRef, MutableRefObject } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { BubbleComponentProps, EditorBubbleComponentProps } from '../componentProps';
import { useNaBubbleState, dispatchNaBubbleState as dispatch } from '../actionReducer';

import { handleChangeFactory, handleKeyDownFactory } from '../editor-specific/handlers';

import Highlight from 'react-highlight';
import 'highlight.js/styles/github.css';
// import 'react-highlight.js/node_modules/highlight.js/styles/github.css';

//type : 'code'
//value : contents

function makeString(v : unknown) : string{
    return typeof v !== 'string' ? '' : v;
}

function RenderedCodeBubble(props: BubbleComponentProps){
    const [ bubble ] = useNaBubbleState('bubble');
    const contents = bubble.record[props.bubbleId].value;

    if(typeof contents !== 'string') return (<></>);
    // return ( 
    //     <Highlight className = { '' } >
    //         { contents }
    //     </Highlight>
    // ); 
    return (
        <pre className='codeBubble renderedCodeBubble'>
            <code>{ contents }</code>
        </pre>
    );
}

function PreviewCodeBubble(props: BubbleComponentProps){
    const [ bubble ] = useNaBubbleState('previewBubble');
    const contents = bubble?.record[props.bubbleId].value;

    if(typeof contents !== 'string') return (<></>);
    // return ( 
    //     <Highlight className = { '' } >
    //         { contents }
    //     </Highlight>
    // ); 
    return (
        <pre className='codeBubble previewCodeBubble'>
            <code>{ contents }</code>
        </pre>
    );
}

function EditorCodeBubble(props: EditorBubbleComponentProps){
    const [ bubble ] = useNaBubbleState('bubble');

    const bid = props.bubbleId;
    const contents = makeString(bubble.record[bid].value);

    return (<>
        <TextareaAutosize autoFocus
            ref = { (el) => { props.refs.current[bid] = el } }
            name={ 'NaBubble' + bid }
            className='editorCodeBubble editorBubble'
            onChange={ handleChangeFactory(bubble, bid, dispatch) } // TODO : ensure onChange is called before onKeyDown?
            onKeyDown={ handleKeyDownFactory(bubble, bid, dispatch, props.refs) }
            // onPaste={ props.onPaste } // pasteHandler
            value={ contents }
            spellCheck={ false } autoComplete='off' autoCorrect='off' autoCapitalize='off'
        />
    </>);
}

export { RenderedCodeBubble, PreviewCodeBubble, EditorCodeBubble };