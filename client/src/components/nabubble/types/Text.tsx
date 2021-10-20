import * as React from 'react';
import { useGlobalState, dispatch } from '../StateReducer';

import TextareaAutosize from 'react-textarea-autosize';

interface BubbleComponentProps extends React.HTMLAttributes<HTMLElement>{
    bubbleId : string
}

//bubble type : 'text'

function makeString(v : unknown) : string{
    return typeof v !== 'string' ? '' : v;
}

function RenderedTextBubble(props: BubbleComponentProps){
    const [ bubble ] = useGlobalState('bubble');
    const contents = bubble.record[props.bubbleId].value;

    if(typeof contents !== 'string') return (<></>);

    return (<div>
        { contents }
    </div>);
}

function EditorTextBubble(props: BubbleComponentProps){
    const [ bubble ] = useGlobalState('bubble');
    var bid = props.bubbleId;

    var v = bubble.record[bid].value;
    var contents = (typeof v !== 'string' ? '' : v);

    const handleChange = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        var str : string = e.target.value;
        dispatch({ type: 'update', id: bid, value : str });
    }

    const handleKeyDown = (e : React.KeyboardEvent<HTMLTextAreaElement>) => {
        //get sibling index.
        var pbid = bubble.record[bid].parentId;
        if(typeof pbid === 'undefined') return;

        var siblingId = bubble.record[pbid].childrenId || [];
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

                document.getElementById('NaBubble' + bid)?.focus();
                // e.currentTarget.focus();
            }
            else{ //trigger 2 : @@@ + enter
                if(str[curStart] !== '\n') return;

                var lineStart : number = str.lastIndexOf('\n',curStart-2) + 1; //previous line.
                //if '\n' not found, lineStart === 0.

                var result = str.slice(lineStart,curStart-1).match(/^(@{3,})([a-zA-Z0-9]*)(?:\[(.*)\])?$/);
                if(!result) return;

                // create a new bubble based on type.
                // for now we only support on text bubbles.
                // result[2] : type
                // result[3] : label
                
                // dispatch({ type: 'update', id: bid, value : str.slice(0, lineStart - 1) });
                // dispatch({ type: 'add', parentId: pbid, idx: idx + 1, bubble: {
                //     type : 'text',
                //     value : str.slice(curStart+1)
                // } });

                dispatch({ type: 'add', parentId: pbid, idx: idx, bubble: {
                    type : 'text',
                    value : str.slice(0, lineStart - 1)
                } });
                dispatch({ type: 'update', id: bid, value : str.slice(curStart + 1) });

                document.getElementById('NaBubble' + bid)?.focus();
                // e.currentTarget.focus();
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
            if(bubble.record[targetbid].type !== 'text') return; //can only merge with text node for now.

            dispatch({ type: 'update', id: bid, value : bubble.record[targetbid].value + '\n' + str });
            dispatch({ type: 'delete', id: targetbid });

            // dispatch({ type: 'delete', id: bid });
            // dispatch({ type: 'update', id: targetbid, value : bubble.record[targetbid].value + '\n' + str });

            console.log(bid);
            console.log(document.getElementById('NaBubble' + bid));

            document.getElementById('NaBubble' + bid)?.focus();
            // e.currentTarget.focus();
        }
        if(e.key === 'Delete'){
            const str : string = e.currentTarget.value;

            const curStart : number = e.currentTarget.selectionStart;
            const curEnd : number = e.currentTarget.selectionEnd;

            if(curStart !== str.length || curStart !== curEnd) return;
            if(idx === siblingId.length - 1) return;

            const targetbid = siblingId[idx+1];
            if(bubble.record[targetbid].type !== 'text') return; //can only merge with text node for now.

            dispatch({ type: 'update', id: bid, value : str + '\n' + bubble.record[targetbid].value });
            dispatch({ type: 'delete', id: targetbid });

            document.getElementById('NaBubble' + bid)?.focus();
            // e.currentTarget.focus();
        }
    }

    return (<>
        <label htmlFor={ 'NaBubble' + bid } style={ {display:'none'} } />
        <TextareaAutosize
            id={ 'NaBubble' + bid }
            name={ 'NaBubble' + bid }
            style={ {display:'block', width:'100%', margin:'10px 0'} }
            onChange={ handleChange } // TODO : ensure onChange is called before onKeyUp?
            onKeyDown={ handleKeyDown }
            // defaultValue={ bubble.contents }
            // value={ contents }
            value={ contents }
        />
    </>);
}

export { RenderedTextBubble, EditorTextBubble };