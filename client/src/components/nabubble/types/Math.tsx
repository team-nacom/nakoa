import React, { useRef, MutableRefObject } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { BubbleComponentProps, EditorBubbleComponentProps } from '../componentProps';
import { useNaBubbleState, dispatchNaBubbleState as dispatch } from '../actionReducer';

import { handleChangeFactory, handleKeyDownFactory } from '../editor-specific/handlers';

import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';

//type : 'math'
//value : contents

function makeString(v : unknown) : string{
    return typeof v !== 'string' ? '' : v;
}

function RenderedMathBubble(props: BubbleComponentProps){
    const [ bubble ] = useNaBubbleState('bubble');
    const contents = bubble.record[props.bubbleId].value;

    if(typeof contents !== 'string') return (<></>);
    return (
        <div style={ { margin: '5px', border: '1px solid green'} }>
            <TeX block math = { contents } />
        </div>
    );
}

function PreviewMathBubble(props: BubbleComponentProps){
    const [ bubble ] = useNaBubbleState('previewBubble');
    const contents = bubble?.record[props.bubbleId].value;

    if(typeof contents !== 'string') return (<></>);
    return (
        <div style={ { margin: '5px', border: '1px solid green'} }>
            <TeX block math = { contents } />
        </div>
    );
}

function EditorMathBubble(props: EditorBubbleComponentProps){
    const [ bubble ] = useNaBubbleState('bubble');

    const bid = props.bubbleId;
    const contents = makeString(bubble.record[bid].value);

    return (<>
        <TextareaAutosize autoFocus
            ref = { (el) => { props.refs.current[bid] = el } }
            name={ 'NaBubble' + bid }
            style={ {display:'block', width:'100%', margin:'10px 0'} }
            onChange={ handleChangeFactory(bubble, bid, dispatch) } // TODO : ensure onChange is called before onKeyDown?
            onKeyDown={ handleKeyDownFactory(bubble, bid, dispatch, props.refs) }
            // onPaste={ props.onPaste } // pasteHandler
            value={ contents }
            spellCheck={ false } autoComplete='off' autoCorrect='off' autoCapitalize='off'
        />
    </>);
}

export { RenderedMathBubble, PreviewMathBubble, EditorMathBubble };