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
    const [ bubble ] = useNaBubbleState('flat');
    const contents = bubble.record[props.cellId].value;

    if (typeof contents !== 'string') return (<></>);
    return (
        <>
            <summary className='mathBubblePreview'>
                수식
            </summary>
            <div className='mathBubble renderedMathBubble' >
                <TeX block math = { contents } />
            </div>
        </>
    );
}

function PreviewMathBubble(props: BubbleComponentProps){
    const [ bubble ] = useNaBubbleState('previewFlat');
    const contents = bubble?.record[props.cellId].value;

    if (typeof contents !== 'string') return (<></>);
    return (
        <>
            <summary className='mathBubblePreview'>
                수식
            </summary>
            <div className='mathBubble previewMathBubble' >
                <TeX block math = { contents } />
            </div>
        </>
    );
}

function EditorMathBubble(props: EditorBubbleComponentProps){
    const [ bubble ] = useNaBubbleState('flat');

    const bid = props.cellId;
    const contents = makeString(bubble.record[bid].value);

    return (<>
        <TextareaAutosize autoFocus
            ref = { (el) => { props.refs.current[bid] = el } }
            name={ 'NaBubble' + bid }
            className='editorMathBubble editorBubble'
            onChange={ handleChangeFactory(bubble, bid, dispatch) } // TODO : ensure onChange is called before onKeyDown?
            onKeyDown={ handleKeyDownFactory(bubble, bid, dispatch, props.refs) }
            // onPaste={ props.onPaste } // pasteHandler
            value={ contents }
            spellCheck={ false } autoComplete='off' autoCorrect='off' autoCapitalize='off'
        />
    </>);
}

export { RenderedMathBubble, PreviewMathBubble, EditorMathBubble };