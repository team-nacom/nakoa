import React, { useRef, MutableRefObject } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { BubbleComponentProps, EditorBubbleComponentProps } from '../componentProps';
import { useNaBubbleState, dispatchNaBubbleState as dispatch } from '../actionReducer';

import { handleChangeFactory, handleKeyDownFactory } from '../editor-specific/handlers';

import MarkdownRenderer from 'components/markdown/MarkdownRenderer';
const MemoizedRenderer = React.memo(MarkdownRenderer);

//type : 'text'
//value : contents

function makeString(v : unknown) : string{
    return typeof v !== 'string' ? '' : v;
}

function RenderedTextBubble(props: BubbleComponentProps){
    const [ bubble ] = useNaBubbleState('bubble');
    const contents = bubble.record[props.bubbleId].value;

    if(typeof contents !== 'string') return (<></>);
    return (
        <div style={ { margin: '5px', border: '1px solid gray'} }>
            <MemoizedRenderer>
                { contents }
            </MemoizedRenderer>
        </div>
    );
}

function PreviewTextBubble(props: BubbleComponentProps){
    const [ bubble ] = useNaBubbleState('previewBubble');
    const contents = bubble?.record[props.bubbleId].value;

    if(typeof contents !== 'string') return (<></>);
    return (
        <div style={ { margin: '5px', border: '1px solid gray'} }>
            <MemoizedRenderer openDetails>
                { contents }
            </MemoizedRenderer>
        </div>
    );
}

function EditorTextBubble(props: EditorBubbleComponentProps){
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
            onPaste={ props.onPaste } // pasteHandler
            value={ contents }
            spellCheck={ false } autoComplete='off' autoCorrect='off' autoCapitalize='off'
        />
    </>);
}

export { RenderedTextBubble, PreviewTextBubble, EditorTextBubble };