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
    const [ bubble ] = useNaBubbleState('flat');
    const contents = bubble.record[props.cellId].value;

    if(typeof contents !== 'string') return (<></>);
    return (
        <div className='textBubble renderedTextBubble'>
            <MemoizedRenderer>
                { contents }
            </MemoizedRenderer>
        </div>
    );
}

function PreviewTextBubble(props: BubbleComponentProps){
    const [ bubble ] = useNaBubbleState('previewFlat');
    const contents = bubble?.record[props.cellId].value;

    if(typeof contents !== 'string') return (<></>);
    return (
        <div className='textBubble previewTextBubble'>
            <MemoizedRenderer openDetails>
                { contents }
            </MemoizedRenderer>
        </div>
    );
}

function EditorTextBubble(props: EditorBubbleComponentProps){
    const [ bubble ] = useNaBubbleState('flat');

    const bid = props.cellId;
    const contents = makeString(bubble.record[bid].value);

    return (<>
        <TextareaAutosize autoFocus
            ref = { (el) => { props.refs.current[bid] = el } }
            name={ 'NaBubble' + bid }
            className='editorTextBubble editorBubble'
            onChange={ handleChangeFactory(bubble, bid, dispatch) } // TODO : ensure onChange is called before onKeyDown?
            onKeyDown={ handleKeyDownFactory(bubble, bid, dispatch, props.refs) }
            onPaste={ props.onPaste } // pasteHandler
            value={ contents }
            spellCheck={ false } autoComplete='off' autoCorrect='off' autoCapitalize='off'
        />
    </>);
}

export { RenderedTextBubble, PreviewTextBubble, EditorTextBubble };