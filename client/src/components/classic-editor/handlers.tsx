import React from 'react';

import { fileUpload, imgUpload } from '#/api'
import { postImage } from '#/api/file';

export function insertText(text: string, elem? : HTMLTextAreaElement){
    if(!elem) return;

    // source: https://kubyshkin.name/posts/insert-text-into-textarea-at-cursor-position/
    const st = elem.selectionStart;
    const ed = elem.selectionEnd;

    elem.setRangeText(text, st, ed);
    elem.selectionStart = elem.selectionEnd = st + text.length;

    // notify to event listeners
    const e = new Event('change', {"bubbles": true, "cancelable": false});
    elem.dispatchEvent(e);
}

export async function pasteHandler(e : React.ClipboardEvent<HTMLTextAreaElement>){
    const elem = e.currentTarget;

    handler : {
        let text = e.clipboardData.getData('text/plain');
        if(text){
            insertText(text, elem);
            break handler;
        }

        // images
        const items = e.clipboardData.items
        for(var i = 0; i < items.length; ++i){
            if(items[i].type.startsWith('image/')){ //image detected
                const blob = items[i].getAsFile();
                if(blob == null) continue;

                imgUploadHelper(blob, elem);
                break handler;
            }
        }
    }
    e.preventDefault();
    e.stopPropagation();
}

export async function imgUploadHelper(file: File, elem?: HTMLTextAreaElement, errorHandler?: (e: unknown) => any ){
    try{
        const result = await postImage(file);
        if(result.local){
            insertText(`\n![](local::${ result.index })\n`, elem);
        }

        // const imgUrl = await imgUpload(file);
        // insertText(`\n![](${ imgUrl })\n`, elem);
    } catch (error){
        if(errorHandler) errorHandler(error);
    }

    return;
}

export async function fileUploadHelper(file: File, elem?: HTMLTextAreaElement, errorHandler?: (e: unknown) => any ){
    try{
        const fileUrl = await fileUpload(file);
        insertText(`[💾 ${ file.name }](${ fileUrl })`, elem);
    } catch (error){
        if(errorHandler) errorHandler(error);
    }

    return;
}