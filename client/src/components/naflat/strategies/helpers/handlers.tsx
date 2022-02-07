import React from 'react';
import { Flat } from '../../flat';
import { FlatState, FlatStateAction } from '../../reducer';

import { fileUpload, imgUpload } from 'etc/FileUpload'

const stringAsIs = (value: unknown) => value as string; //default 'fromValue' argument (if necessary)
const valueAsIs = (str: string) => str; // default 'toValue' argument.

// Change handler(textarea & input)
function handleChangeFactory(dispatch: React.Dispatch<FlatStateAction>, id: string, toValue? : (str: string) => unknown){
    return (ev : React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        dispatch({
            type: 'update', id,
            value: (toValue || valueAsIs)(ev.target.value)
        });
    }
}

type CursorOption = 'start' | 'wrap' | 'end';

// utility function to handle textarea selected element.
// returns [updatedString, newCursorStart, newCursorEnd].
function applyRange(
    str : string,
    fn: (str: string)=> string,
    start?: number,
    end?: number,
    cursorOption? : CursorOption
){
    if(start === undefined || end === undefined){
        start = str.length;
        end = str.length;
    }

    let prefix = str.slice(0,start);
    let target = fn( str.slice(start,end) );
    let postfix = str.slice(end);

    let newStr = prefix + target + postfix;
    let newStart = str.length, newEnd = str.length;
    switch(cursorOption || 'end'){
        case 'start':
            newStart = newEnd = prefix.length;
            break;
        case 'wrap':
            newStart = prefix.length;
            newEnd = prefix.length + target.length;
            break;
        case 'end':
            newStart = newEnd = prefix.length + target.length;
            break;
    }
    return [newStr, newStart, newEnd] as const;
}

// Paste helper : upload, dispatch, handle error and return markdown string
// textarea value update should be handled externally.

async function imgUploadHelper(dispatch: React.Dispatch<FlatStateAction>, id: string, file: File, str: string, start?: number, end?: number, toValue?: (str: string) => unknown, errorHandler?: (err: unknown) => any){
    try{
        const imgUrl = await imgUpload(file); //no catch
        const text = `\n![](${ imgUrl })\n`;

        const [newStr, cursorStart, cursorEnd] = applyRange( str, (() => text), start, end, 'end' );

        dispatch({
            type: 'update', id,
            value: (toValue || valueAsIs)(newStr),
            cursorStart, cursorEnd
        })

        return [newStr, cursorStart, cursorEnd] as const;
    } catch(err){
        if(errorHandler) errorHandler(err);

        return [str, start || str.length, end || str.length] as const;
    }
}

async function fileUploadHelper(dispatch: React.Dispatch<FlatStateAction>, id: string, file: File, str: string, start?: number, end?: number, toValue?: (str: string) => unknown, errorHandler?: (err: unknown) => any){
    try{
        const fileUrl = await fileUpload(file);
        const text = `[💾 ${ file.name }](${ fileUrl })`;

        const [newStr, cursorStart, cursorEnd] = applyRange( str, (() => text), start, end, 'end' );

        dispatch({
            type: 'update', id,
            value: (toValue || valueAsIs)(newStr),
            cursorStart, cursorEnd
        })

        return [newStr, cursorStart, cursorEnd] as const;
    } catch(err){
        if(errorHandler) errorHandler(err);

        return [str, start || str.length, end || str.length] as const;
    }
}

function handlePasteFactory(dispatch: React.Dispatch<FlatStateAction>, id: string, toValue? : (str: string) => unknown){
    return async (ev : React.ClipboardEvent<HTMLTextAreaElement>) => {
        ev.preventDefault();
        ev.stopPropagation();

        //paste text.
        let text = ev.clipboardData.getData('text/plain');
        if(text){
            let [newStr, cursorStart, cursorEnd] = applyRange(
                ev.currentTarget.value, // state[id].value ??
                () => text,
                ev.currentTarget.selectionStart,
                ev.currentTarget.selectionEnd,
                'end'
            );

            dispatch({
                type: 'update', id,
                value: (toValue || valueAsIs)(newStr),
                cursorStart, cursorEnd
            })
            return;
        }

        // paste image (in textarea)
        for(const item of ev.clipboardData.items){
            if(item.type.indexOf('image') === 0){ //image detected
                const blob = item.getAsFile();
                if(blob === null) continue;

                const [newStr, newStart, newEnd] = await imgUploadHelper(
                    dispatch, id,
                    blob,
                    ev.currentTarget.value,
                    ev.currentTarget.selectionStart,
                    ev.currentTarget.selectionEnd,
                    toValue,
                    (err) => { console.log('이미지 업로드 실패', err) }, //error handler
                );

                // ev.currentTarget.value = newStr;
                // ev.currentTarget.selectionStart = newStart;
                // ev.currentTarget.selectionEnd = newEnd;

                // TODO : update ev.currentTarget BEFORE DISPATCH (to prevent DOM rerendering)
            }
        }
    }
}

///////////////// Shortcut-related /////////////////////

interface IShortcut<T = any>{
    keymap: string[];
    description?: string;
    handler: (ev?: React.KeyboardEvent<T>) => any;
}

// Local Shortcut Handlers(dependent on cellId)
function handleTextShortcutFactory(state: FlatState, dispatch: React.Dispatch<FlatStateAction>, cellId: string, toValue?: (str: string) => unknown){

    function makeTextHandler(fn: (str: string) => string, cursorOption?: CursorOption){
        return (ev?: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if(!ev) return;
            
            const [newStr, cursorStart, cursorEnd] = applyRange(
                ev.currentTarget.value,
                fn,
                ev.currentTarget.selectionStart,
                ev.currentTarget.selectionEnd,
                cursorOption
            );

            ev.currentTarget.value = newStr;
            ev.currentTarget.selectionStart = cursorStart;
            ev.currentTarget.selectionEnd = cursorEnd;

            dispatch({
                type: 'update', id: cellId,
                value: (toValue || valueAsIs)(newStr),
                cursorStart, cursorEnd
            })
        }
    }

    const textShortcut: Record<string,IShortcut<HTMLTextAreaElement>> = {
        'bold' : {
            keymap: ['control+b'],
            description: 'boldface text',
            handler: makeTextHandler((str: string)=>{
                if(str.slice(0,2) === '**' && str.slice(-2) === '**' ){
                    return str.slice(2,-2);
                }
                return '**' + str + '**';
            }, 'wrap')
        },
        'italic' : {
            keymap: ['control+i'],
            description: 'italic text',
            handler: makeTextHandler((str: string)=>{
                if(str.slice(0,2) === '**' && str.slice(-2) === '**' ){
                    return '*' + str + '*'; //bold already.
                }
                else if(str.slice(0,1) === '*' && str.slice(-1) === '*' ){
                    return str.slice(1,-1);
                }
                return '*' + str + '*';
            }, 'wrap')
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
    imgUploadHelper,
    fileUploadHelper
}
