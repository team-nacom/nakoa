import React, { useRef, MutableRefObject } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { BubbleComponentProps, EditorBubbleComponentProps } from '../componentProps';
import { dispatchNaBubbleState as dispatch } from '../actionReducer';

import MarkdownRenderer from 'components/markdown/MarkdownRenderer';
const MemoizedRenderer = React.memo(MarkdownRenderer);

//bubble type : 'text'

function makeString(v : unknown) : string{
    return typeof v !== 'string' ? '' : v;
}

function RenderedTextBubble(props: BubbleComponentProps){
    const contents = props.bubbleObj.record[props.bubbleId].value;

    if(typeof contents !== 'string') return (<></>);

    return (
        <div style={ { margin: '5px', border: '1px solid gray'} }>
            <MemoizedRenderer noTOC openDetails>
                { contents }
            </MemoizedRenderer>
        </div>
    );
}

function EditorTextBubble(props: EditorBubbleComponentProps){
    const record = props.bubbleObj.record;
    var bid = props.bubbleId;

    // var v = bubble.record[bid].value;
    var contents = makeString(record[bid].value);

    const handleChange = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        var str : string = e.target.value;
        dispatch({ type: 'update', id: bid, value : str });
    }

    const handleKeyDown = (e : React.KeyboardEvent<HTMLTextAreaElement>) => {
        //get sibling index.
        var pbid = record[bid].parentId;
        if(typeof pbid === 'undefined') return;

        var siblingId = record[pbid].childrenId || [];
        var idx = siblingId.indexOf(bid);
        if(idx === -1) idx = siblingId.length;

        // console.log(bid);

        //bubble splits.
        if(e.key === 'Enter'){
            const str : string = e.currentTarget.value;

            const curStart : number = e.currentTarget.selectionStart;
            const curEnd : number = e.currentTarget.selectionEnd;
            if(e.ctrlKey){ //trigger 1 : ctrl + enter. text bubbles only
                dispatch({ type: 'add', parentId: pbid, idx: idx, bubble: {
                    type : 'text',
                    value : str[curStart - 1] === '\n' ? str.slice(0,curStart-1) : str.slice(0, curStart)
                } });
                dispatch({ type: 'update', id: bid, value : (
                    str[curStart] === '\n' ? str.slice(curStart + 1) : str.slice(curStart)
                ) });

                // props.refs.current[bid]?.focus();
                setTimeout(()=>{
                    const newElem = props.refs.current[bid] as HTMLTextAreaElement;
                    newElem.focus();
                    newElem.selectionStart = 0;
                    newElem.selectionEnd = 0;
                }, 1); //is this legit??
            }
            else{ //trigger 2 : @@@ + enter
                if(str[curStart] !== '\n') return;

                var lineStart : number = str.lastIndexOf('\n',curStart-2) + 1; //previous line.
                //if '\n' not found, lineStart === 0.

                var result = str.slice(lineStart,curStart-1).match(/^(@{3,})([a-zA-Z0-9]*)(?:\[(.*)\])?$/);
                if(!result) return;

                // create a new bubble based on type. for now we only support on text bubbles.
                // [_, _, type, label] = result

                dispatch({ type: 'add', parentId: pbid, idx: idx, bubble: {
                    type : 'text',
                    value : str.slice(0, lineStart - 1)
                } });
                dispatch({ type: 'update', id: bid, value : str.slice(curStart + 1) });

                // props.refs.current[bid]?.focus();
                setTimeout(()=>{
                    const newElem = props.refs.current[bid] as HTMLTextAreaElement;
                    newElem.focus();
                    newElem.selectionStart = 0;
                    newElem.selectionEnd = 0;
                }, 1);
            }
        }

        //bubble merge.
        if(e.key === 'Backspace'){
            const str : string = e.currentTarget.value;

            const curStart : number = e.currentTarget.selectionStart;
            const curEnd : number = e.currentTarget.selectionEnd;

            if(curStart !== 0 || curStart !== curEnd) return;
            if(idx === 0) return;

            const targetbid = siblingId[idx-1];
            if(record[targetbid].type !== 'text') return; //can only merge with text node for now.

            const targetStr = record[targetbid].value + '';

            dispatch({ type: 'update', id: bid, value : targetStr + '\n' + str });
            dispatch({ type: 'delete', id: targetbid });

            // props.refs.current[bid]?.focus();
            setTimeout(()=>{
                const newElem = props.refs.current[bid] as HTMLTextAreaElement;
                newElem.focus();
                newElem.selectionStart = targetStr.length;
                newElem.selectionEnd = targetStr.length;
            }, 1);
        }
        if(e.key === 'Delete'){
            const str : string = e.currentTarget.value;

            const curStart : number = e.currentTarget.selectionStart;
            const curEnd : number = e.currentTarget.selectionEnd;

            if(curStart !== str.length || curStart !== curEnd) return;
            if(idx === siblingId.length - 1) return;

            const targetbid = siblingId[idx+1];
            if(record[targetbid].type !== 'text') return; //can only merge with text node for now.

            dispatch({ type: 'update', id: bid, value : str + '\n' + record[targetbid].value });
            dispatch({ type: 'delete', id: targetbid });

            // props.refs.current[bid]?.focus();
            setTimeout(()=>{
                const newElem = props.refs.current[bid] as HTMLTextAreaElement;
                newElem.focus();
                newElem.selectionStart = str.length;
                newElem.selectionEnd = str.length;
            }, 1);
        }
    }

    return (<>
        <label htmlFor={ 'NaBubble' + bid } style={ {display:'none'} } />
        <TextareaAutosize
            ref = { (el) => { props.refs.current[bid] = el } }
            name={ 'NaBubble' + bid }
            style={ {display:'block', width:'100%', margin:'10px 0'} }
            onChange={ handleChange } // TODO : ensure onChange is called before onKeyDown?
            onKeyDown={ handleKeyDown }
            value={ contents }
            spellCheck={ false } autoComplete='off' autoCorrect='off' autoCapitalize='off'
        />
    </>);
}

export { RenderedTextBubble, EditorTextBubble };