import React, { useEffect } from 'react';

import { CellComponentProps, CellRenderStrategy, FlatContext } from '../componentTypes';

import {
    handleChangeFactory,
    handlePasteFactory,
    handleTextShortcutFactory
} from './helpers/handlers';
import SingletonTextArea from './helpers/singletonTextArea';

import {
    imgUploadHelper,
    fileUploadHelper
} from './helpers/handlers';
import { FileDropzone } from './helpers/FileDropzone';

import MarkdownRenderer from 'components/markdown/MarkdownRenderer';
const MemoizedRenderer = React.memo(MarkdownRenderer);

function DisplayTextCell(props: CellComponentProps){
    const { state } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let contents = cell.value;

    if(typeof contents !== 'string') return <></>;

    //TODO : make perrefMap DRY
    const label = state.renderInfo.label;
    var perrefMap : Record<string,string> = {};
    for(var keyId in label){
        perrefMap[keyId] = label[keyId].custom || label[keyId].autoType.join('.');
    }

    return (
        <div className='textCell'>
            <MemoizedRenderer
                mathMacros = { state.renderInfo.macros.math }
                perrefMap = { perrefMap }
            >
                { contents }
            </MemoizedRenderer>
        </div>
    );
}


function PreviewTextCell(props: CellComponentProps){
    const { state } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let contents = cell.value;

    if(typeof contents !== 'string') return <></>;

    const label = state.renderInfo.label;
    var perrefMap : Record<string,string> = {};
    for(var keyId in label){
        perrefMap[keyId] = label[keyId].custom || label[keyId].autoType.join('.');
    }

    return (
        <div className='textCell'>
            <MemoizedRenderer openDetails
                mathMacros = { state.renderInfo.macros.math }
                perrefMap = { perrefMap }
            >
                { contents }
            </MemoizedRenderer>
        </div>
    );
}


function EditorTextCell(props: CellComponentProps){
    const { state, dispatch } = React.useContext(FlatContext);

    let cell = state.flat[props.cellId];
    let contents = cell.value;

    const shortcuts = handleTextShortcutFactory(state, dispatch, props.cellId);

    //bind keys. (todo: do something better, or integrate to react-keybind.)
    function onKeyDown(ev: React.KeyboardEvent<HTMLTextAreaElement>){
        let pressed = ev.key.toLowerCase();

        for(let sc in shortcuts){
            for(let cfg of shortcuts[sc].keymap){
                let arr = cfg.split('+');
                let flag = true;
                for(let key of arr){
                    if( key === 'control' || key === 'ctrl'){
                        if(!ev.ctrlKey){ flag = false; break; }
                    }
                    else if(key === 'alt'){
                        if(!ev.altKey){ flag = false; break; }
                    }
                    else if(key === 'shift'){
                        if(!ev.shiftKey){ flag = false; break; }
                    }
                    else if(key === 'meta' || key === 'cmd'){
                        if(!ev.metaKey){ flag = false; break; }
                    }
                    else{
                        if(key !== pressed){
                            flag = false; break;
                        }
                    }
                }
                if(flag){
                    shortcuts[sc].handler(ev);
                    break;
                }
            }
        }
    }

    //reset cursor after render.
    useEffect(()=>{
        return ()=>{
            dispatch({ type: 'resetCursor' });
        }
    }, []);

    if(typeof contents !== 'string') return <></>;

    return (
        <>
            <div className='editorTextCellWrapper'>
                <SingletonTextArea
                    initialSelectionStart={ state.cursorStart }
                    initialSelectionEnd={ state.cursorEnd }
                    className='editorTextCell editorCell'
                    onChange={handleChangeFactory(dispatch, props.cellId)}
                    onPaste={handlePasteFactory(dispatch, props.cellId)}
                    onKeyDown={ onKeyDown }
                    value={contents}
                />
                <div className='dropzone textCellDropzone'>
                    <FileDropzone
                        handleDrop={ (files) => imgUploadHelper(
                            dispatch, props.cellId, files[0],
                            state.flat[props.cellId].value as string,
                            undefined, undefined,
                            str => str,
                            () => { console.log('이미지 업로드 실패') }
                        )}
                    >
                        { '이미지 업로드' }
                    </FileDropzone>
                    <FileDropzone
                        handleDrop={ (files) => fileUploadHelper(
                            dispatch, props.cellId, files[0],
                            state.flat[props.cellId].value as string,
                            undefined, undefined,
                            str => str,
                            () => { console.log('파일 업로드 실패') }
                        )}
                    >
                        { '파일 업로드' }
                    </FileDropzone>
                </div>
            </div>
            <div className='previewTextCellWrapper'>
                <PreviewTextCell {...props} />
            </div>
        </>
    );
}

const TextCellStrategy : CellRenderStrategy = {
    'display': DisplayTextCell,
    'preview': PreviewTextCell,
    'editor' : EditorTextCell
}

export default TextCellStrategy;