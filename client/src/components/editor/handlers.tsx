import React from 'react';

import { fileUpload, imgUpload } from 'etc/FileUpload'

import { FormattedMessage, useIntl } from 'react-intl';

function insertText(text : string, elem? : HTMLTextAreaElement){
    const isSuccess = document.execCommand('insertText', false, text);

    if(!isSuccess){
        if(!elem) return;

        // source: https://kubyshkin.name/posts/insert-text-into-textarea-at-cursor-position/
        const st = elem.selectionStart;
        const ed = elem.selectionEnd;

        elem.setRangeText(text, st, ed);
        elem.selectionStart = elem.selectionEnd = st + text.length;

        // notify to event listeners
        const e = document.createEvent('UIEvent');
        e.initEvent('input',true,false);
        elem.dispatchEvent(e);
    }
}

async function pasteHandler(e : React.ClipboardEvent<HTMLTextAreaElement>){
    const elem = e.currentTarget;

    handler : {
        let text = e.clipboardData.getData('text/plain');
        if(text){
            insertText(text, elem);
            break handler;
        }

        // images
        for(const item of e.clipboardData.items){
            if(item.type.indexOf('image') === 0){ //image detected
                const blob = item.getAsFile();
                if(blob == null) continue;

                imgUploadHelper(blob, elem);
                break handler;
            }
        }
    }
    e.preventDefault();
    e.stopPropagation();
}

async function imgUploadHelper(file: File, elem?: HTMLTextAreaElement){
    const intl = useIntl();

    try{
        const imgUrl = await imgUpload(file);
        insertText(`\n![](${ imgUrl })\n`, elem);
    } catch (error){
        // img uploading error handler
        alert( intl.formatMessage({id: 'editor.uploadFailed'}) );
    }

    return;
}

async function fileUploadHelper(file: File, elem?: HTMLTextAreaElement){
    const intl = useIntl();

    try{
        const fileUrl = await fileUpload(file);
        insertText(`[💾 ${ file.name }](${ fileUrl })`, elem);
    } catch (error){
        // file uploading error handler
        alert( intl.formatMessage({id: 'editor.uploadFailed'}) );
    }

    return;
}

export { insertText, pasteHandler, imgUploadHelper, fileUploadHelper };