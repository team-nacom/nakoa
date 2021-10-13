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

    const handleKeyUp = (e : React.KeyboardEvent<HTMLTextAreaElement>) => {
        //get sibling index.
        var pbid = bubble.record[bid].parentId;
        if(typeof pbid === 'undefined') return;

        var siblingId = bubble.record[pbid].childrenId || [];
        var idx = siblingId.indexOf(bid);
        if(idx === -1) idx = siblingId.length;

        //bubble splits.
        if(e.key === 'Enter'){
            const str : string = e.currentTarget.value;

            var curStart : number = e.currentTarget.selectionStart;
            var curEnd : number = e.currentTarget.selectionEnd;
            if(str[curStart] !== '\n') return;

            var lineStart : number = str.lastIndexOf('\n',curStart-2) + 1; //previous line.
            //if '\n' not found, lineStart === 0.

            var result = str.slice(lineStart,curStart-1).match(/^(@{3,})([a-zA-Z0-9]*)(?:\[(.*)\])?$/);
            if(!result) return;

            // create a new bubble based on type.
            // for now we only support on text bubbles.
            // result[2] : type
            // result[3] : label
            
            dispatch({ type: 'update', id: bid, value : str.slice(0, lineStart - 1) });
            dispatch({ type: 'add', parentId: pbid, idx: idx + 1, bubble: {
                type : 'text',
                value : str.slice(curStart)
            } });
        }
    }

    return (<TextareaAutosize
        style={ {display:'block', width:'100%', margin:'10px 0'} }
        onChange={ handleChange } // TODO : ensure onChange is called before onKeyUp?
        onKeyUp={ handleKeyUp }
        // defaultValue={ bubble.contents }
        // value={ contents }
        value={ contents }
    />);
}

export { RenderedTextBubble, EditorTextBubble };