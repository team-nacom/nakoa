import React, { useEffect } from 'react';

import { TCell } from '../cell';
import { FlatContext } from '../state';
import { CellComponentProps, CellRenderStrategy } from '../componentTypes';

import {
    handleChangeFactory,
    handlePasteFactory,
    handleTextShortcutFactory
} from './helpers/handlers';
import SingletonTextArea from './helpers/singletonTextArea';

import MarkdownRenderer from 'components/markdown/MarkdownRenderer';

function DisplayTextCell(props: CellComponentProps){
    const { state } = React.useContext(FlatContext);
    let cell = state.flat[props.cellId] as TCell<'text'>;

    let contents = cell.value;

    if(typeof contents !== 'string') return <></>;

    return (
        <div className='textCell'>
            <MarkdownRenderer
                mathMacroObj = { state.mathMacroObj }
                perrefMap = { state.typedLabel }
            >
                { contents }
            </MarkdownRenderer>
        </div>
    );
}


function PreviewTextCell(props: CellComponentProps){
    const { state } = React.useContext(FlatContext);
    let cell = state.flat[props.cellId] as TCell<'text'>;

    let contents = cell.value;

    if(typeof contents !== 'string') return <></>;

    return (
        <div className='textCell'>
            <MarkdownRenderer openDetails
                mathMacroObj = { state.mathMacroObj }
                perrefMap = { state.typedLabel }
            >
                { contents }
            </MarkdownRenderer>
        </div>
    );
}


function EditorTextCell(props: CellComponentProps){
    const { state, dispatch } = React.useContext(FlatContext);
    let cell = state.flat[props.cellId] as TCell<'text'>;

    let contents = cell.value;

    // const shortcuts = handleTextShortcutFactory(state, dispatch, props.cellId);

    //bind keys. (todo: do something better, or integrate to react-keybind.)
    // function onKeyDown(ev: React.KeyboardEvent<HTMLTextAreaElement>){
    //     let pressed = ev.key.toLowerCase();

    //     for(let sc in shortcuts){
    //         for(let cfg of shortcuts[sc].keymap){
    //             let arr = cfg.split('+');
    //             let flag = true;
    //             for(let key of arr){
    //                 if( key === 'control' || key === 'ctrl'){
    //                     if(!ev.ctrlKey){ flag = false; break; }
    //                 }
    //                 else if(key === 'alt'){
    //                     if(!ev.altKey){ flag = false; break; }
    //                 }
    //                 else if(key === 'shift'){
    //                     if(!ev.shiftKey){ flag = false; break; }
    //                 }
    //                 else if(key === 'meta' || key === 'cmd'){
    //                     if(!ev.metaKey){ flag = false; break; }
    //                 }
    //                 else{
    //                     if(key !== pressed){
    //                         flag = false; break;
    //                     }
    //                 }
    //             }
    //             if(flag){
    //                 shortcuts[sc].handler(ev);
    //                 break;
    //             }
    //         }
    //     }
    // }

    //reset cursor after render.
    useEffect(()=>{
        return ()=>{
            dispatch({ type: 'resetCursor' });
        }
    }, []);

    if(typeof contents !== 'string') return <></>;

    return (
        <div className='editorTextCellWrapper'>
            <SingletonTextArea
                initialSelectionStart={ state.cursorStart }
                initialSelectionEnd={ state.cursorEnd }
                className='editorTextCell editorCell'
                onChange={handleChangeFactory(dispatch, props.cellId)}
                onPaste={handlePasteFactory(dispatch, props.cellId)}
                // onKeyDown={ onKeyDown }
                value={contents}
            />
            <PreviewTextCell {...props} />
        </div>
    );
}

const TextCellStrategy : CellRenderStrategy = {
    'display': DisplayTextCell,
    'preview': PreviewTextCell,
    'editor' : EditorTextCell
}

export default TextCellStrategy;