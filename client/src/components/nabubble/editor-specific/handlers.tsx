import React from 'react';
import { FlatBubble } from '../data';
import { BubbleAction, BubbleSubAction } from '../action';

type dispatchType = (action : BubbleAction | BubbleSubAction) => BubbleAction | BubbleSubAction;

type refsType = React.MutableRefObject<Record<string,HTMLElement | null>>;

//focuser. can we do this as a promise?
function focusElem(refs: refsType, bid: string, pos: number){
    setTimeout(()=>{
        const elem = refs.current[bid] as HTMLTextAreaElement;
        elem.focus();
        elem.selectionStart = elem.selectionEnd = pos;
    }, 10);
}

function handleChangeFactory(fb: FlatBubble, bid: string, dispatch: dispatchType){
    return (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        var str : string = e.target.value;
        dispatch({ type: 'update', id: bid, value : str });
    }
}

function handleKeyDownFactory(fb: FlatBubble, bid: string, dispatch: dispatchType, refs : React.MutableRefObject<Record<string,HTMLElement | null>> ){
    const record = fb.record;

    return (e : React.KeyboardEvent<HTMLTextAreaElement>) => {
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
                focusElem(refs,bid,0);
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
                focusElem(refs,bid,0);
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
            focusElem(refs,bid,targetStr.length);
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
            focusElem(refs,bid,str.length);
        }
    }
}

export { handleChangeFactory, handleKeyDownFactory };