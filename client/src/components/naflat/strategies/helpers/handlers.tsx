import React from 'react';
import { Flat } from '../../flat';
import { FlatState, FlatStateAction } from '../../reducer';

function handleChangeFactory(id: string, dispatch: React.Dispatch<FlatStateAction>){
    return (e : React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        let str : string = e.target.value;
        dispatch({ type: 'update', id, value : str });
    }
}


// function handleKeyDownFactory(flat: Flat, cid: string, dispatch: dispatchType, refs : React.MutableRefObject<Record<string,HTMLElement | null>> ){
//     const record = flat.record;

//     return (e : React.KeyboardEvent<HTMLTextAreaElement>) => {
//         //get sibling index.
//         var pcid = record[cid].parentId;
//         if(typeof pcid === 'undefined') return;

//         // var siblingId = record[pcid].childrenId || [];

//         const evalSiblingId = () => {return record[pcid || '_'].childrenId || []};
//         var siblingId = evalSiblingId();

//         var idx = siblingId.indexOf(cid);
//         if(idx === -1) idx = siblingId.length;
    
//         // console.log(cid);
    
//         //bubble splits.
//         if(e.key === 'Enter'){
//             const str : string = e.currentTarget.value;

    
//             const curStart : number = e.currentTarget.selectionStart;
//             const curEnd : number = e.currentTarget.selectionEnd;
//             if(e.ctrlKey){ //trigger 1 : ctrl + enter. text bubbles only
//                 dispatch({ type: 'update', id: cid,
//                     value : str[curStart] === '\n' ? str.slice(0,curStart-1) : str.slice(0, curStart)
//                 });
//                 dispatch({ type: 'add', parentId: pcid, idx: idx + 1, bubble: {
//                     type : 'text',
//                     value : str[curStart - 1] === '\n' ? str.slice(curStart + 1) : str.slice(curStart)
//                 } });

//                 // will be autofocused on newly created element
//                 focusSibling(refs,evalSiblingId,idx+1,0);
//             }
//             else{ //trigger 2 : ;;; + enter
//                 if(str[curStart] !== '\n' && curStart !== str.length) return;
    
//                 const lineStart : number = str.lastIndexOf('\n',curStart-1) + 1; //previous line.
//                 //if '\n' not found, lineStart === 0.
    
//                 var result = str.slice(lineStart,curStart).match(/^(;{3,})([a-zA-Z0-9]*)(?:\[(.*)\])?$/);
//                 if(!result) return;

//                 // create a new bubble based on type. for now we only support on text-behavior bubbles.
//                 var [_, _, _type, label] = result;
//                 var type = _type as BubbleType;
//                 if(bubbleBehavior[type] !== 'text' ){
//                     type = 'text';
//                 }
                
//                 dispatch({ type: 'update', id: cid, value : str.slice(0, lineStart ? lineStart - 1 : 0) });
//                 dispatch({ type: 'add', parentId: pcid, idx: idx+1, bubble: {
//                     type : type,
//                 //     value : ''
//                 // } });
//                 // dispatch({ type: 'add', parentId: pcid, idx: idx+2, bubble: {
//                 //     type : 'text',
//                     value : str.slice(curStart)
//                 } });

//                 // will be autofocused on newly created element
//                 focusSibling(refs,evalSiblingId,idx+1,0);
//             }
//         }
    
//         //bubble merge.
//         if(e.key === 'Backspace'){
//             const str : string = e.currentTarget.value;
    
//             const curStart : number = e.currentTarget.selectionStart;
//             const curEnd : number = e.currentTarget.selectionEnd;
    
//             if(curStart !== 0 || curStart !== curEnd) return;
//             if(idx === 0) return;
    
//             const targetcid = siblingId[idx-1];
//             if( bubbleBehavior[ record[targetcid].type ] !== 'text') return; //can only merge with text node for now.
    
//             const targetStr = record[targetcid].value + '';
            
//             //first bubble remains.
//             dispatch({ type: 'update', id: targetcid, value : targetStr + (str ? '\n' + str : '') });
//             dispatch({ type: 'delete', id: cid });
//             focusElem(refs,targetcid,targetStr.length);
//         }
//         if(e.key === 'Delete'){
//             const str : string = e.currentTarget.value;
    
//             const curStart : number = e.currentTarget.selectionStart;
//             const curEnd : number = e.currentTarget.selectionEnd;
    
//             if(curStart !== str.length || curStart !== curEnd) return;
//             if(idx === siblingId.length - 1) return;
    
//             const targetcid = siblingId[idx+1];
//             if( bubbleBehavior[ record[targetcid].type ] !== 'text') return; //can only merge with text node for now.
            
//             //first bubble remains.
//             dispatch({ type: 'update', id: cid, value : (str ? str + '\n' : '') + record[targetcid].value });
//             dispatch({ type: 'delete', id: targetcid });
//             focusElem(refs,cid,str.length);
//         }
//     }
// }

// export { focusSibling };
export {
    handleChangeFactory,
};

