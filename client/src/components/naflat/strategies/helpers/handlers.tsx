import React from 'react';
import { Flat } from '../../flat';
import { FlatState, FlatStateAction } from '../../reducer';

import { fileUpload, imgUpload } from 'etc/FileUpload'

// Change handler

function handleChangeFactory(id: string, dispatch: React.Dispatch<FlatStateAction>){
    return (e : React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        let str : string = e.target.value;
        dispatch({ type: 'update', id, value : str });
    }
}

// Paste handler(only for textarea)
function imgUploadHelperFactory(id: string, dispatch: React.Dispatch<FlatStateAction>){
    return async function (file: File, start: number, end: number, errorHandler?: (err: unknown) => any){
        let aStart : number | undefined = start;
        let aEnd : number | undefined = end;
        if(start < 0 || end < 0){
            aStart = aEnd = undefined;
        }
        try{
            const imgUrl = await imgUpload(file);
            const text = `\n![](${ imgUrl })\n`;

            dispatch({
                type: 'updateSelected',
                id, start : aStart, end : aEnd,
                cursorOption: 'end',
                func : () => (text)
            });
        } catch(err){
            if(errorHandler) errorHandler(err);
        }
    }
}

function fileUploadHelperFactory(id: string, dispatch: React.Dispatch<FlatStateAction>){
    return async function (file: File, start: number, end: number, errorHandler?: (err: unknown) => any){
        let aStart : number | undefined = start;
        let aEnd : number | undefined = end;
        if(start < 0 || end < 0){
            aStart = aEnd = undefined;
        }
        try{
            const fileUrl = await fileUpload(file);
            const text = `[💾 ${ file.name }](${ fileUrl })`;

            dispatch({
                type: 'updateSelected',
                id, start : aStart, end : aEnd,
                cursorOption: 'end',
                func : () => (text)
            });
        } catch(err){
            if(errorHandler) errorHandler(err);
        }
    }
}

function handlePasteFactory(id: string, dispatch: React.Dispatch<FlatStateAction>){
    return (e : React.ClipboardEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        e.stopPropagation();

        //paste text.
        let text = e.clipboardData.getData('text/plain');
        if(text){
            dispatch({
                type: 'updateSelected',
                id,
                start: e.currentTarget.selectionStart,
                end: e.currentTarget.selectionEnd,
                cursorOption: 'end',
                func: () => (text)
            });
            return;
        }

        // paste image (in textarea)
        for(const item of e.clipboardData.items){
            if(item.type.indexOf('image') === 0){ //image detected
                const blob = item.getAsFile();
                if(blob === null) continue;

                imgUploadHelperFactory(id, dispatch)(
                    blob,
                    e.currentTarget.selectionStart,
                    e.currentTarget.selectionEnd,
                    () => { console.log('이미지 업로드 실패') }
                );
            }
        }
    }
}

/////////////////

interface IShortcut<T = any>{
    keymap: string[];
    description?: string;
    handler: (ev?: React.KeyboardEvent<T>) => any;
}

// Local Shortcut Handlers(dependent on cellId)
function handleTextShortcutFactory(state: FlatState, cellId: string, dispatch: React.Dispatch<FlatStateAction>){
    const textShortcut: Record<string,IShortcut<HTMLTextAreaElement>> = {
        'bold' : {
            keymap: ['control+b'],
            description: 'boldface text',
            handler: (ev) => {
                dispatch({
                    type: 'updateSelected',
                    id: cellId,
                    start: ev?.currentTarget?.selectionStart,
                    end: ev?.currentTarget?.selectionEnd,
                    cursorOption: 'wrap',
                    func: (str) => {
                        if(str.slice(0,2) === '**' && str.slice(-2) === '**' ){
                            return str.slice(2,-2);
                        }
                        return '**' + str + '**';
                    }
                });
            }
        },
    }

    return textShortcut;
}

// Global Shortcut Handlers(independent on cellId)
function handleGlobalShortcutFactory(state: FlatState, dispatch: React.Dispatch<FlatStateAction>){
    const localShortcut: Record<string, IShortcut> = {
        'goUp' : {
            keymap: ['control+arrowup'],
            description: 'go to previous cell',
            handler: (ev) => {
                dispatch({ type: 'focusAdj', direction: -1});
            }
        },
        'goDown' : {
            keymap: ['control+arrowdown'],
            description: 'go to next cell',
            handler: (ev) => {
                dispatch({ type: 'focusAdj', direction: 1});
            }
        },
        'blur': {
            keymap: ['escape'],
            description: 'defocus',
            handler: (ev) => {
                if(state.focusId === undefined){
                    console.log('not focusing anything!')
                }

                dispatch({ type: 'blur' });
            }
        }
    }

    return localShortcut;
}

// TODO : cell separation by enter, merge by backsp or del

export {
    handleChangeFactory,
    handlePasteFactory,

    handleTextShortcutFactory,
    handleGlobalShortcutFactory
};
export {
    imgUploadHelperFactory,
    fileUploadHelperFactory
}
